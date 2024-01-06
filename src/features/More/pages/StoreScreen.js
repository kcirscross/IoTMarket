/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import { Colors, Gutters, Layout } from '@/assets/styles';
import { AppDropDown, AppText } from '@/components/GlobalComponents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Avatar, Card, Divider, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
import AvatarPickerBottomSheet from '../components/AvatarPickerBottomSheet';

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

  const [chosenCity, setChosenCity] = useState(
    currentUser?.address?.city ?? '',
  );
  const [chosenDistrict, setChosenDistrict] = useState(
    currentUser?.address?.district ?? '',
  );
  const [chosenWard, setChosenWard] = useState(
    currentUser?.address?.ward ?? '',
  );
  const [chosenStreet, setChosenStreet] = useState(
    currentUser?.address?.street ?? '',
  );

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
        currentUser.storeId !== undefined && (
          <View style={Layout.rowHCenter}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SettingStore')}
              style={{
                marginRight: 5,
              }}
            >
              <Icon name="cog" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        ),
    });
  }, []);

  //Get Store Information if Exist
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
              .catch(err => console.log('Report: ', err));

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

  useEffect(() => {
    getCity();
    getOrder();
  }, []);

  useEffect(() => {
    valueCity !== null && getDistrict(valueCity);
  }, [valueCity]);

  useEffect(() => {
    valueDistrict !== null && getWard(valueDistrict);
  }, [valueDistrict]);

  const getCity = useCallback(async () => {
    let list = [];
    await axios({
      method: 'get',
      url: 'https://provinces.open-api.vn/api/p/',
    })
      .then(res => {
        if (res.status === 200) {
          res.data.forEach(city =>
            list.push({
              label: city.name,
              value: city.code,
            }),
          );
          setItemsCity(list);
          setValueCity(
            list.filter(item => item.label === currentUser?.address?.city)[0]
              ?.value ?? null,
          );
        }
      })
      .catch(err => console.log(err));
  }, []);

  const getDistrict = useCallback(
    async code => {
      let list = [];

      await axios({
        method: 'get',
        url: `https://provinces.open-api.vn/api/p/${code}`,
        params: {
          depth: 2,
        },
      })
        .then(res => {
          if (res.status === 200) {
            res.data.districts.forEach(districts =>
              list.push({
                label: districts.name,
                value: districts.code,
              }),
            );
            setItemsDistrict(list);

            if (chosenCity === currentUser?.address?.city) {
              setValueDistrict(
                list.find(item => item.label === currentUser?.address?.district)
                  ?.value ?? null,
              );
            } else {
              setValueDistrict(null);
              setValueWard(null);
            }
          }
        })
        .catch(err => console.log(err));
    },
    [chosenCity],
  );

  const getWard = useCallback(
    async code => {
      let list = [];
      await axios({
        method: 'get',
        url: `https://provinces.open-api.vn/api/d/${code}`,
        params: {
          depth: 2,
        },
      })
        .then(res => {
          if (res.status === 200) {
            res.data.wards.forEach(wards =>
              list.push({
                label: wards.name,
                value: wards.code,
              }),
            );
            setItemsWard(list);

            chosenDistrict === currentUser?.address?.district
              ? setValueWard(
                  list.find(item => item.label === currentUser?.address?.ward)
                    ?.value ?? null,
                )
              : setValueWard(null);
          }
        })
        .catch(err => console.log(err));
    },
    [chosenDistrict],
  );

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

  const handleCreateStoreClick = async uri => {
    //Validate
    if (
      displayName === '' ||
      displayName.length < 15 ||
      description === '' ||
      description.length < 15 ||
      chosenStreet === '' ||
      shopImage === '' ||
      chosenCity === '' ||
      chosenDistrict === '' ||
      chosenWard === ''
    ) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all field',
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
                        if (res.status === 200) {
                          setModalLoading(false);
                          setIsLoading(false);
                          Toast.show({
                            type: 'success',
                            text1: 'Please wait Admin approve your request',
                          });
                        }
                      })
                      .catch(err => {
                        setModalLoading(false);
                        setIsLoading(false);
                        console.log(err.response.data);
                        if (
                          err.response.data.message ===
                          'This user already sent request and currently waiting for approval'
                        ) {
                          Toast.show({
                            type: 'error',
                            text1: 'This user already sent request.',
                          });
                        } else if (
                          err.response.data.message ===
                          'The user must update its phone to be able to open store store'
                        ) {
                          Alert.alert(
                            'Error',
                            'Please update your phone number in Profile Settings',
                          );
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

        index === dataRevenue.length - 1 &&
          setRevenue({ labels: labels, datasets: [{ data: datasets }] });
      });
  };

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

  const handleCloseModalAvatar = () => {
    setModalAvatarVisible(false);
  };

  const handleAvatarChange = asset => {
    setShopImage(asset.uri);
    setFilePath(`users/${currentUser.email}/shopImage/${asset.fileName}`);
  };

  return !isLoading ? (
    <SafeAreaView
      style={{
        ...globalStyles.container,
        paddingHorizontal: 0,
      }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={[Layout.scroll, Gutters.tinyHPadding]}
      >
        {currentUser.storeId === undefined ? (
          <View style={Layout.fill}>
            <AppText style={styles.labelStyle}>Store Logo</AppText>

            <TouchableOpacity
              onPress={() => setModalAvatarVisible(true)}
              style={Layout.center}
            >
              <Avatar
                rounded
                size={90}
                source={
                  shopImage === ''
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
                color={Colors.black}
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
              onChangeText={setDisplayName}
            />

            <Input
              placeholder="Store Description"
              containerStyle={styles.textContainer}
              label="Store Description (At least 15 characters)"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.inputContainer}
              renderErrorMessage={false}
              onChangeText={setDescription}
            />

            <Input
              placeholder="Detail Address"
              containerStyle={styles.textContainer}
              label="Detail Address"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.inputContainer}
              renderErrorMessage={false}
              defaultValue={currentUser?.address?.street ?? ''}
              onChangeText={setChosenStreet}
            />

            <View style={[Gutters.tinyTMargin, styles.firstZIndex]}>
              <AppText style={styles.labelStyle}>Choose your city</AppText>

              <AppDropDown
                open={openCity}
                value={valueCity}
                items={itemsCity}
                setOpen={setOpenCity}
                setValue={setValueCity}
                setItems={setItemsCity}
                placeholder={'Select your city'}
                onSelectItem={item => {
                  setChosenCity(item.label);
                  getDistrict(item.value);
                }}
                dropDownDirection="TOP"
              />
            </View>

            <View style={[Gutters.smallTMargin, styles.secondZIndex]}>
              <AppText style={styles.labelStyle}>Choose your district</AppText>

              <AppDropDown
                open={openDistrict}
                value={valueDistrict}
                items={itemsDistrict}
                setOpen={setOpenDistrict}
                setValue={setValueDistrict}
                setItems={setItemsDistrict}
                placeholder={'Select your district'}
                onSelectItem={item => {
                  getWard(item.value);
                  setChosenDistrict(item.label);
                }}
                dropDownDirection="TOP"
              />
            </View>

            <View style={[Gutters.smallTMargin, styles.thirdZIndex]}>
              <AppText style={styles.labelStyle}>Choose your ward</AppText>

              <AppDropDown
                open={openWard}
                value={valueWard}
                items={itemsWard}
                setOpen={setOpenWard}
                setValue={setValueWard}
                setItems={setItemsWard}
                placeholder={'Select your ward'}
                onSelectItem={item => setChosenWard(item.label)}
                dropDownDirection="TOP"
              />
            </View>

            <TouchableOpacity
              onPress={() => handleCreateStoreClick(shopImage)}
              style={{
                ...globalStyles.button,
                alignSelf: 'center',
                marginTop: 40,
                marginBottom: 20,
              }}
            >
              <AppText style={globalStyles.textButton}>Create Store</AppText>
            </TouchableOpacity>
          </View>
        ) : (
          <Fragment>
            <Card
              containerStyle={{
                ...globalStyles.cardContainer,
                marginTop: 10,
              }}
            >
              <View style={Layout.rowHCenter}>
                <Avatar
                  rounded
                  size={65}
                  source={
                    storeInfo.shopImage === ''
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
                            currentUser.storeId !== undefined
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
                <Text style={styles.chartTitle}>Revenue of last 6 months</Text>

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
          </Fragment>
        )}
      </KeyboardAwareScrollView>

      {modalAvatarVisible && (
        <AvatarPickerBottomSheet
          onDismiss={handleCloseModalAvatar}
          onChange={handleAvatarChange}
        />
      )}

      <ModalLoading visible={modalLoading} />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={globalStyles.container}>
      <ModalLoading visible={modalLoading} />
    </SafeAreaView>
  );
};

export default StoreScreen;

const styles = StyleSheet.create({
  firstZIndex: { zIndex: 100 },
  secondZIndex: { zIndex: 101 },
  thirdZIndex: { zIndex: 102 },
  labelStyle: {
    color: Colors.black,
    fontWeight: 'bold',
    marginVertical: 5,
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
