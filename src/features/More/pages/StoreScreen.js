import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DropDownPicker from 'react-native-dropdown-picker';
import { Avatar, Card, Divider, Input } from 'react-native-elements';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ion from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import ModalLoading from '~/components/utils/ModalLoading';
import { globalStyles } from '../../../assets/styles/globalStyles';
import {
  API_URL,
  AVATAR_BORDER,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from '../../../components/constants';
import { getAPI } from '../../../components/utils/base_API';

const StoreScreen = ({ navigation }) => {
  const currentUser = useSelector(state => state.user);
  const isFocus = useIsFocused();

  const [openCity, setOpenCity] = useState(false);
  const [valueCity, setValueCity] = useState(null);
  const [itemsCity, setItemsCity] = useState([]);

  const [openDistrict, setOpenDistrict] = useState(false);
  const [valueDistrict, setValueDistrict] = useState(null);
  const [itemsDistrict, setItemsDistrict] = useState([]);

  const [openWard, setOpenWard] = useState(false);
  const [valueWard, setValueWard] = useState(null);
  const [itemsWard, setItemsWard] = useState([]);

  const [chosenCity, setChosenCity] = useState('');
  const [chosenDistrict, setChosenDistrict] = useState('');
  const [chosenWard, setChosenWard] = useState('');
  const [chosenStreet, setChosenStreet] = useState('');

  const [modalLoading, setModalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [shopImage, setShopImage] = useState('');
  const [modalAvatarVisible, setModalAvatarVisible] = useState(false);
  const [filePath, setFilePath] = useState('');

  const [storeInfo, setStoreInfo] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [countShipping, setCountShipping] = useState(0);
  const [countDelivered, setCountDelivered] = useState(0);

  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const getCity = async () => {
    let list = [];
    await axios({
      method: 'get',
      url: 'https://provinces.open-api.vn/api/p/',
    })
      .then(res => {
        if (res.status == 200) {
          res.data.forEach(city =>
            list.push({
              label: city.name,
              value: city.code,
            }),
          );
          setItemsCity(list);
        }
      })
      .catch(err => console.log(err));
  };

  const getDistrict = async code => {
    let list = [];
    await axios({
      method: 'get',
      url: `https://provinces.open-api.vn/api/p/${code}`,
      params: {
        depth: 2,
      },
    })
      .then(res => {
        if (res.status == 200) {
          res.data.districts.forEach(districts =>
            list.push({
              label: districts.name,
              value: districts.code,
            }),
          );
          setItemsDistrict(list);
        }
      })
      .catch(err => console.log(err));
  };

  const getWard = async code => {
    let list = [];
    await axios({
      method: 'get',
      url: `https://provinces.open-api.vn/api/d/${code}`,
      params: {
        depth: 2,
      },
    })
      .then(res => {
        if (res.status == 200) {
          res.data.wards.forEach(wards =>
            list.push({
              label: wards.name,
              value: wards.code,
            }),
          );
          setItemsWard(list);
        }
      })
      .catch(err => console.log(err));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'My Store',
      headerStyle: { backgroundColor: PRIMARY_COLOR },
      headerTintColor: 'white',
      headerShown: true,
      headerBackTitleStyle: {
        color: 'white',
      },
      headerRight: () =>
        currentUser.storeId != undefined && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SettingStore')}
              style={{
                marginRight: 5,
              }}
            >
              <Icon name="cog" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ),
    });
  }, []);

  const getOrder = () => {
    setModalLoading(true);

    getAPI({ url: 'order/seller' })
      .then(res => {
        if (res.status === 200) {
          let countDel = 0;
          let countShip = 0;
          res.data.orders.map((order, index) => {
            order.shippingLogs[order.shippingLogs.length - 1].status ===
            'delivered'
              ? countDel++
              : countShip++;

            if (index === res.data.orders.length - 1) {
              setCountDelivered(countDel);
              setCountShipping(countShip);
            }
          });

          setModalLoading(false);
        }
      })
      .catch(err => console.log('Get Order: ', err));
  };

  useEffect(() => {
    getCity();

    getOrder();
  }, []);

  const handleCreateStoreClick = async uri => {
    //Validate
    if (
      displayName == '' ||
      displayName.length < 15 ||
      description == '' ||
      description.length < 15 ||
      chosenStreet == '' ||
      shopImage == '' ||
      chosenCity == '' ||
      chosenDistrict == '' ||
      chosenWard == ''
    ) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all field.',
      });
    } else {
      try {
        setModalLoading(true);
        setIsLoading(true);

        //Upload Image
        await storage()
          .ref(filePath)
          .putFile(uri)
          .then(async () => {
            //Get URL
            await storage()
              .ref(filePath)
              .getDownloadURL()
              .then(async url => {
                try {
                  await AsyncStorage.getItem('token').then(async token => {
                    await axios({
                      method: 'post',
                      url: `${API_URL}/user/storerequest`,
                      headers: {
                        authorization: `Bearer ${token}`,
                      },
                      data: {
                        displayName: displayName,
                        description: description,
                        shopImage: url.toString(),
                        address: {
                          street: chosenStreet,
                          district: chosenDistrict,
                          ward: chosenWard,
                          city: chosenCity,
                        },
                      },
                    })
                      .then(res => {
                        if (res.status == 200) {
                          setModalLoading(false);
                          setIsLoading(false);
                          Toast.show({
                            type: 'success',
                            text1: 'Please wait Admin approve your request.',
                          });
                        }
                      })
                      .catch(err => {
                        setModalLoading(false);
                        setIsLoading(false);
                        console.log(err.response.data);
                        if (
                          err.response.data.message ==
                          'This user already sent request and currently waiting for approval'
                        ) {
                          Toast.show({
                            type: 'error',
                            text1: 'This user already sent request.',
                          });
                        }
                      });
                  });
                } catch (error) {
                  setModalLoading(false);
                  setIsLoading(false);
                  console.log('Error Upload Image ', error.message);
                }
              });
          });
      } catch (error) {
        setModalLoading(false);
        setIsLoading(false);
        console.log('Error Upload Image: ', error);
      }
    }
  };

  const pickImageFromGallery = async () => {
    await launchImageLibrary(
      {
        mediaType: 'photo',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      res => {
        if (res.didCancel != true) {
          setShopImage(res.assets[0].uri);
          setFilePath(
            `users/${currentUser.email}/shopImage/${res.assets[0].fileName}`,
          );
        }
      },
    );
  };

  const pickImageFromCamera = async () => {
    await launchCamera(
      {
        mediaType: 'photo',
      },
      res => {
        if (res.didCancel != true) {
          setShopImage(res.assets[0].uri);
          setFilePath(
            `users/${currentUser.email}/shopImage/${res.assets[0].fileName}`,
          );
        }
      },
    );
  };

  //Handle data for chart
  const handleRevenue = dataRevenue => {
    let labels = [];
    let datasets = [];

    dataRevenue.sort((a, b) => {
      return a._id.month - b._id.month;
    });

    dataRevenue.length !== 0 &&
      dataRevenue.map((month, index) => {
        labels.push(month._id.month.toString());
        datasets.push(month.total_monthly_revenue_ / 100);

        index == dataRevenue.length - 1 &&
          setRevenue({ labels: labels, datasets: [{ data: datasets }] });
      });
  };

  //Get Store Infomation if Exist
  useEffect(() => {
    if (currentUser.storeId !== undefined) {
      setModalLoading(true);
      setIsLoading(true);
      getAPI({ url: `store/${currentUser.storeId}` })
        .then(res => {
          if (res.status === 200) {
            setStoreInfo(res.data.store);
            setFollowers(res.data.store.followers.length);

            getAPI({
              url: `store/report/${res.data.store._id}`,
            })
              .then(res => {
                if (res.status === 200) {
                  handleRevenue(res.data.revenue);
                  setTopProducts(res.data.topFiveSoldProduct);
                }
              })
              .catch(err => console.log('Repror: ', err));

            setModalLoading(false);
            setIsLoading(false);
          }
        })
        .catch(err => {
          setModalLoading(false);
          setIsLoading(false);
          console.log('Get Store: ', err);
        });
    }
  }, [isFocus]);

  const chartConfig = {
    backgroundGradientFrom: 'white',
    backgroundGradientFromOpacity: 0.5,
    backgroundGradientTo: 'white',
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(0, 101, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    style: {
      borderRadius: 16,
    },
  };

  const graphStyle = {
    marginVertical: 8,
    ...chartConfig.style,
  };

  const formatYLabel = yLabel => {
    let yLabelNew = Math.round(yLabel);
    if (yLabelNew / 1000000 > 1) {
      yLabelNew = Math.round(yLabelNew / 1000000) + 'M';
    } else if (yLabelNew / 1000 > 1) {
      yLabelNew = yLabelNew / 1000 + 'K';
    }
    return yLabelNew;
  };

  const formatXLabel = xLabel => {
    switch (xLabel) {
      case '1':
        return 'Jan';

      case '2':
        return 'Feb';

      case '3':
        return 'Mar';

      case '4':
        return 'Apr';

      case '5':
        return 'May';

      case '6':
        return 'Jun';

      case '7':
        return 'Jul';

      case '8':
        return 'Aug';

      case '9':
        return 'Sep';

      case '10':
        return 'Oct';

      case '11':
        return 'Nov';

      case '12':
        return 'Dec';

      default:
        return '';
    }
  };

  return !isLoading ? (
    <SafeAreaView
      style={{
        ...globalStyles.container,
        opacity: modalLoading ? 0.5 : 1,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior="height"
          style={{
            height: '100%',
            width: '100%',
          }}
        >
          <ModalLoading visible={modalLoading} />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalAvatarVisible}
          >
            <SafeAreaView
              style={{
                flex: 1,
              }}
            >
              <View style={styles.modalView}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      ...styles.labelStyle,
                      fontSize: 18,
                      marginLeft: -10,
                    }}
                  >
                    Choose your image from?
                  </Text>

                  <View style={{ flex: 1 }} />

                  <TouchableOpacity
                    onPress={() => setModalAvatarVisible(false)}
                  >
                    <Ion name="close-circle-outline" size={30} color="black" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setModalAvatarVisible(false);
                    pickImageFromGallery();
                  }}
                  style={styles.touchModalView}
                >
                  <Text
                    style={{
                      ...styles.labelStyle,
                      fontSize: 18,
                    }}
                  >
                    Gallery
                  </Text>

                  <Ion name="images-outline" size={64} color={PRIMARY_COLOR} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setModalAvatarVisible(false);
                    pickImageFromCamera();
                  }}
                  style={{
                    ...styles.touchModalView,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      ...styles.labelStyle,
                      fontSize: 18,
                    }}
                  >
                    Camera
                  </Text>

                  <Ion name="camera-outline" size={64} color={PRIMARY_COLOR} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Modal>

          {currentUser.storeId == undefined ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...styles.labelStyle,
                    fontSize: 20,
                  }}
                >
                  Store Logo
                </Text>

                <TouchableOpacity
                  onPress={() => setModalAvatarVisible(true)}
                  style={{
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    rounded
                    size={90}
                    source={
                      shopImage == ''
                        ? require('~/assets/images/logo.jpg')
                        : { uri: shopImage }
                    }
                    avatarStyle={{
                      borderColor: AVATAR_BORDER,
                      borderWidth: 1,
                    }}
                  />

                  <Icon
                    name="camera"
                    size={24}
                    color="black"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: '38%',
                    }}
                  />
                </TouchableOpacity>

                <Input
                  placeholder="Store Name"
                  containerStyle={styles.textContainer}
                  label="Store Name (At least 15 characters)"
                  labelStyle={styles.labelStyle}
                  inputContainerStyle={styles.inputContainer}
                  renderErrorMessage={false}
                  onChangeText={text => setDisplayName(text)}
                />

                <Input
                  placeholder="Store Description"
                  containerStyle={styles.textContainer}
                  label="Store Description (At least 15 character)"
                  labelStyle={styles.labelStyle}
                  inputContainerStyle={styles.inputContainer}
                  renderErrorMessage={false}
                  onChangeText={text => setDescription(text)}
                />

                <View>
                  <Input
                    placeholder="Detail Address"
                    containerStyle={styles.textContainer}
                    label="Detail Address"
                    labelStyle={styles.labelStyle}
                    inputContainerStyle={styles.inputContainer}
                    renderErrorMessage={false}
                    onChangeText={text => setChosenStreet(text)}
                  />
                </View>

                <View
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.labelStyle}>Choose your city.</Text>
                  <DropDownPicker
                    open={openCity}
                    value={valueCity}
                    items={itemsCity}
                    placeholder={'Select your city.'}
                    labelStyle={{
                      color: 'black',
                    }}
                    setOpen={setOpenCity}
                    setValue={setValueCity}
                    setItems={setItemsCity}
                    onSelectItem={item => {
                      getDistrict(item.value);
                      setChosenCity(item.label);
                    }}
                    style={styles.dropStyle}
                    zIndex={3}
                    dropDownContainerStyle={{
                      borderColor: SECONDARY_COLOR,
                    }}
                  />
                </View>
                <View
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.labelStyle}>Choose your district.</Text>
                  <DropDownPicker
                    open={openDistrict}
                    value={valueDistrict}
                    items={itemsDistrict}
                    placeholder={'Select your district.'}
                    labelStyle={{
                      color: 'black',
                    }}
                    setOpen={setOpenDistrict}
                    setValue={setValueDistrict}
                    setItems={setItemsDistrict}
                    onSelectItem={item => {
                      getWard(item.value);
                      setChosenDistrict(item.label);
                    }}
                    style={styles.dropStyle}
                    zIndex={2}
                    dropDownContainerStyle={{
                      borderColor: SECONDARY_COLOR,
                    }}
                  />
                </View>
                <View
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.labelStyle}>Choose your ward.</Text>
                  <DropDownPicker
                    open={openWard}
                    value={valueWard}
                    items={itemsWard}
                    labelStyle={{
                      color: 'black',
                    }}
                    placeholder={'Select your ward.'}
                    setOpen={setOpenWard}
                    setValue={setValueWard}
                    setItems={setItemsWard}
                    style={styles.dropStyle}
                    zIndex={1}
                    onSelectItem={item => setChosenWard(item.label)}
                    dropDownContainerStyle={{
                      borderColor: SECONDARY_COLOR,
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => handleCreateStoreClick(shopImage)}
                  style={{
                    ...globalStyles.button,
                    alignSelf: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Text style={globalStyles.textButton}>Create Store</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Card
                containerStyle={{
                  ...globalStyles.cardContainer,
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    rounded
                    size={65}
                    source={
                      storeInfo.shopImage == ''
                        ? require('~/assets/images/logo.jpg')
                        : { uri: storeInfo.shopImage }
                    }
                    avatarStyle={{
                      borderColor: AVATAR_BORDER,
                      borderWidth: 1,
                    }}
                  />

                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text
                      style={{
                        ...styles.labelStyle,
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}
                    >
                      {storeInfo.displayName}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 10,
                        }}
                      >
                        <Ion name="star" color="#FA8128" size={16} />
                        <Text
                          style={{
                            color: 'black',
                            marginLeft: 5,
                          }}
                        >
                          {storeInfo.rating}/5
                          {'     '}|
                        </Text>

                        <Text>{'     '}</Text>
                        <Ion name="person" color={PRIMARY_COLOR} size={16} />
                        <Text
                          style={{
                            color: 'black',
                            marginLeft: 5,
                          }}
                        >
                          {storeInfo.followers?.length} Followers
                        </Text>
                      </View>

                      <View style={{ flex: 1 }} />

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Profile', {
                            0:
                              currentUser.storeId != undefined
                                ? currentUser.storeId
                                : currentUser._id,
                          })
                        }
                        style={{
                          borderWidth: 1,
                          borderColor: PRIMARY_COLOR,
                          padding: 5,
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            ...styles.labelStyle,
                            color: PRIMARY_COLOR,
                          }}
                        >
                          See My Store
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Card>

              <Card
                containerStyle={{
                  ...globalStyles.cardContainer,
                  marginTop: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Order', {
                      from: 'seller',
                    })
                  }
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginVertical: 5,
                  }}
                >
                  <Text style={{ color: 'black' }}>Order History</Text>
                  <Ion name="chevron-forward-outline" size={24} color="black" />
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    marginBottom: 5,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Order', {
                        from: 'seller',
                      })
                    }
                    style={styles.touchView}
                  >
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: '600',
                        fontSize: 16,
                      }}
                    >
                      {countShipping}
                    </Text>
                    <Text style={{ color: 'black' }}>Shipping</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Order', {
                        from: 'seller',
                      })
                    }
                    style={styles.touchView}
                  >
                    <Text
                      style={{
                        color: 'black',
                        fontWeight: '600',
                        fontSize: 16,
                      }}
                    >
                      {countDelivered}
                    </Text>
                    <Text style={{ color: 'black' }}>Delivered</Text>
                  </TouchableOpacity>
                </View>
              </Card>

              {Object.keys(revenue).length > 0 && (
                <Card
                  containerStyle={{
                    ...globalStyles.cardContainer,
                    marginTop: 5,
                  }}
                >
                  <Text style={styles.chartTitle}>
                    Revenue of last 6 months
                  </Text>

                  <LineChart
                    data={revenue}
                    style={graphStyle}
                    formatYLabel={yLabel => formatYLabel(yLabel)}
                    formatXLabel={xLabel => formatXLabel(xLabel)}
                    width={360}
                    height={220}
                    chartConfig={chartConfig}
                  />
                </Card>
              )}

              {Object.keys(topProducts).length > 0 && (
                <Card
                  containerStyle={{
                    ...globalStyles.cardContainer,
                    marginTop: 5,
                    marginBottom: 10,
                  }}
                >
                  <Text style={styles.chartTitle}>Top 5 Sold Products</Text>

                  {topProducts.map((product, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                      }}
                    >
                      <Text
                        style={{
                          color: PRIMARY_COLOR,
                          fontWeight: '600',
                        }}
                      >
                        {`Top ${index + 1}`}
                      </Text>

                      <Divider
                        color={PRIMARY_COLOR}
                        orientation="vertical"
                        width={1}
                        style={{ marginVertical: 15 }}
                      />

                      <Image
                        source={{
                          uri: product.thumbnailImage,
                        }}
                        style={{
                          width: 80,
                          height: 80,
                        }}
                        resizeMethod="resize"
                        resizeMode="contain"
                      />

                      <Divider
                        color={PRIMARY_COLOR}
                        orientation="vertical"
                        width={1}
                        style={{ marginVertical: 15 }}
                      />

                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={{
                          color: 'black',
                          fontSize: 16,
                          fontWeight: '600',
                          width: '50%',
                        }}
                      >
                        {product.productName}
                      </Text>

                      <Divider
                        color={PRIMARY_COLOR}
                        orientation="vertical"
                        width={1}
                        style={{ marginVertical: 15 }}
                      />

                      <Text
                        style={{
                          color: 'black',
                          fontSize: 16,
                          fontWeight: '600',
                        }}
                      >
                        {product.soldCount}
                      </Text>
                    </View>
                  ))}
                </Card>
              )}
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <Toast position="bottom" bottomOffset={70} />
    </SafeAreaView>
  ) : (
    <SafeAreaView
      style={{
        ...globalStyles.container,
        opacity: modalLoading ? 0.5 : 1,
      }}
    >
      <ModalLoading visible={modalLoading} />
    </SafeAreaView>
  );
};

export default StoreScreen;

const styles = StyleSheet.create({
  labelStyle: {
    color: 'black',
    fontWeight: 'normal',
  },
  textContainer: {
    marginTop: 10,
    paddingHorizontal: 0,
  },
  modalView: {
    backgroundColor: 'white',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  touchModalView: {
    alignItems: 'center',
  },
  inputContainer: {
    ...globalStyles.input,
    width: '100%',
    marginTop: 0,
    borderBottomWidth: 0,
    paddingVertical: 5,
  },
  dropStyle: {
    backgroundColor: 'white',
    shadowColor: PRIMARY_COLOR,
    elevation: 5,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderColor: SECONDARY_COLOR,
  },

  touchView: {
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
  },
  chartTitle: {
    alignSelf: 'center',
    fontSize: 18,
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
});
