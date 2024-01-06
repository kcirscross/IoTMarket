/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import { Fonts, Gutters, Layout } from '@/assets/styles';
import { AppDropDown, AppInput, AppText } from '@/components/GlobalComponents';
import firebase from '@react-native-firebase/app';
import axios from 'axios';
import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import ModalLoading from '~/components/utils/ModalLoading';
import { globalStyles } from '../../../assets/styles/globalStyles';
import { API_URL, PRIMARY_COLOR } from '../../../components/constants';
import { patchAPI, postAPI } from '../../../components/utils/base_API';
import UploadImageItem from '../components/UploadImageItem';
import ImagePickerBottomSheet from './ImagePickerBottomSheet';

const UploadDetailScreen = ({ navigation, route }) => {
  const currentUser = useSelector(state => state.user);
  const [listImages, setListImages] = useState([]);
  const [modalLoading, setModalLoading] = useState(true);
  const [modalPhotos, setModalPhotos] = useState(false);

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productAmount, setProductAmount] = useState(1);
  const [heightBeforeBoxed, setHeightBeforeBoxed] = useState('');
  const [weightBeforeBoxed, setWeightBeforeBoxed] = useState('');
  const [widthBeforeBoxed, setWidthBeforeBoxed] = useState('');
  const [lengthBeforeBoxed, setLengthBeforeBoxed] = useState('');
  const [heightAfterBoxed, setHeightAfterBoxed] = useState('');
  const [weightAfterBoxed, setWeightAfterBoxed] = useState('');
  const [widthAfterBoxed, setWidthAfterBoxed] = useState('');
  const [lengthAfterBoxed, setLengthAfterBoxed] = useState('');

  const [openCondition, setOpenCondition] = useState(false);
  const [valueCondition, setValueCondition] = useState(null);
  const [itemsCondition, setItemsCondition] = useState([
    {
      label: 'New',
      value: 'New',
    },
    {
      label: 'Used - Like New',
      value: 'Used - Like New',
    },
    {
      label: 'Used - Good',
      value: 'Used - Good',
    },
    {
      label: 'Used - Fair',
      value: 'Used - Fair',
    },
  ]);
  const [chosenCondition, setChosenCondition] = useState('');

  const [listSubCategory, setListSubCategory] = useState([]);
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const [valueSubCategory, setValueSubCategory] = useState(null);
  const [chosenSubCategory, setChosenSubCategory] = useState('');

  const isEdit = route.params.isEdit;
  const product = route.params.product;
  const [defaultSubCategory, setDefaultSubCategory] = useState('');
  const [firstLoading, setFirstLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.category.categoryName,
      headerStyle: { backgroundColor: PRIMARY_COLOR },
      headerTintColor: 'white',
      headerShown: true,
      headerBackTitleStyle: {
        color: 'white',
      },
    });
  }, []);

  //Loading SubCategory
  useEffect(() => {
    let listSub = [];
    axios({
      method: 'get',
      url: `${API_URL}/subcategory/${route.params.category._id}`,
    })
      .then(res => {
        if (res.status === 200) {
          res.data.subcategories.forEach(sub => {
            listSub.push({
              label: sub.subcategoryName,
              value: sub._id,
            });
            isEdit &&
              sub._id === product.subcategoryId &&
              setDefaultSubCategory(sub);
          });
          setListSubCategory(listSub);

          setModalLoading(false);
          setFirstLoading(false);
        }
      })
      .catch(error => console.log('SubCategory: ', error));
  }, []);

  //Set Variable if in Edit mode
  useEffect(() => {
    if (isEdit) {
      setListImages(product.detailImages);
      setChosenSubCategory(defaultSubCategory._id);
      setProductName(product.productName);
      setProductDescription(product.description);
      setProductPrice(product.price);
      setProductAmount(product.numberInStock);
      setChosenCondition(product.condition);
      setWeightBeforeBoxed(product.weight);
      setHeightBeforeBoxed(product.height);
      setWidthBeforeBoxed(product.width);
      setLengthBeforeBoxed(product.length);
      setWeightAfterBoxed(product.weightAfterBoxing);
      setHeightAfterBoxed(product.heightAfterBoxing);
      setWidthAfterBoxed(product.widthAfterBoxing);
      setLengthAfterBoxed(product.lengthAfterBoxing);
    }
  }, []);

  let getData = childData => {
    const new_arr = listImages.filter(item => item !== childData);
    setListImages(new_arr);
  };

  const uploadProduct = async () => {
    setModalLoading(true);
    const filePath = `products/${
      currentUser.email + '_' + productName + '_' + Date.now()
    }/images`;
    let list = [];

    try {
      listImages.map(async (item, index) => {
        await firebase
          .storage()
          .ref(
            `${filePath}/${listImages[index].substring(
              listImages[index].lastIndexOf('/') + 1,
            )}`,
          )
          .putFile(item)
          .then(() => {
            if (index === listImages.length - 1) {
              firebase
                .storage()
                .ref(filePath)
                .list()
                .then(result => {
                  result.items.map(
                    async (item, index) =>
                      await firebase
                        .storage()
                        .ref(item.fullPath)
                        .getDownloadURL()
                        .then(url => {
                          list.push(url);
                          if (index === result.items.length - 1) {
                            list.unshift(filePath);
                            postAPI({
                              url: 'product',
                              data: {
                                thumbnailImage: list[1],
                                productName: productName,
                                subcategoryId: chosenSubCategory,
                                description: productDescription,
                                categoryId: route.params.category._id,
                                detailImages: list,
                                video: '',
                                weight: parseFloat(weightBeforeBoxed),
                                height: parseFloat(heightBeforeBoxed),
                                width: parseFloat(widthBeforeBoxed),
                                length: parseFloat(lengthBeforeBoxed),
                                weightAfterBoxing: parseFloat(weightAfterBoxed),
                                heightAfterBoxing: parseFloat(heightAfterBoxed),
                                widthAfterBoxing: parseFloat(widthAfterBoxed),
                                lengthAfterBoxing: parseFloat(lengthAfterBoxed),
                                price: productPrice,
                                numberInStock:
                                  currentUser.storeId !== undefined
                                    ? parseFloat(productAmount)
                                    : 1,
                                condition: chosenCondition,
                              },
                            })
                              .then(res => {
                                if (res.status === 200) {
                                  setModalLoading(false);
                                  Alert.alert(
                                    'Upload product successfully.',
                                    '',
                                    [
                                      {
                                        text: 'OK',
                                        onPress: () =>
                                          navigation.replace('Profile', {
                                            0:
                                              currentUser.storeId !== undefined
                                                ? currentUser.storeId
                                                : currentUser._id,
                                          }),
                                      },
                                    ],
                                  );
                                }
                              })
                              .catch(err => {
                                console.log(err);
                                setModalLoading(false);
                              });
                          }
                        }),
                  );
                });
            }
          });
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateProduct = (deleteImages, containImages) => {
    // setModalLoading(true)
    let listName = [];
    if (deleteImages.length > 0) {
      deleteImages.forEach(image => {
        listName.push(image.split('%2Fimages%2F')[1].split('?alt')[0]);
      });

      listName.forEach(name => {
        firebase.storage().ref(`${route.params.bucketPath}/${name}`).delete();
      });

      if (containImages.length > 0) {
        if (JSON.stringify(listImages) === JSON.stringify(containImages)) {
          containImages.unshift(route.params.bucketPath);

          patchAPI({
            url: `product/${product._id}`,
            data: {
              thumbnailImage: containImages[1],
              productName: productName,
              subcategoryId: chosenSubCategory,
              description: productDescription,
              categoryId: route.params.category._id,
              detailImages: containImages,
              video: '',
              weight: parseFloat(weightBeforeBoxed),
              height: parseFloat(heightBeforeBoxed),
              width: parseFloat(widthBeforeBoxed),
              length: parseFloat(lengthBeforeBoxed),
              weightAfterBoxing: parseFloat(weightAfterBoxed),
              heightAfterBoxing: parseFloat(heightAfterBoxed),
              widthAfterBoxing: parseFloat(widthAfterBoxed),
              lengthAfterBoxing: parseFloat(lengthAfterBoxed),
              price: productPrice,
              numberInStock:
                currentUser.storeId !== undefined
                  ? parseFloat(productAmount)
                  : 1,
              condition: chosenCondition,
            },
          })
            .then(res => {
              if (res.status === 200) {
                setModalLoading(false);
                Alert.alert('Update product successfully.', '', [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]);
              }
            })
            .catch(err => {
              console.log(err);
              setModalLoading(false);
            });
        } else {
          let listURL = [];

          listImages.forEach((image, index) => {
            if (!containImages.includes(image)) {
              firebase
                .storage()
                .ref(
                  `${route.params.bucketPath}/${image.substring(
                    image.lastIndexOf('/') + 1,
                  )}`,
                )
                .putFile(image)
                .then(() => {
                  if (index === listImages.length - 1) {
                    firebase
                      .storage()
                      .ref(route.params.bucketPath)
                      .list()
                      .then(results => {
                        results.items.map((item, index) => {
                          firebase
                            .storage()
                            .ref(item.fullPath)
                            .getDownloadURL()
                            .then(url => {
                              listURL.push(url);

                              if (index === results.items.length - 1) {
                                listURL.unshift(route.params.bucketPath);

                                patchAPI({
                                  url: `product/${product._id}`,
                                  data: {
                                    thumbnailImage: listURL[1],
                                    productName: productName,
                                    subcategoryId: chosenSubCategory,
                                    description: productDescription,
                                    categoryId: route.params.category._id,
                                    detailImages: listURL,
                                    video: '',
                                    weight: parseFloat(weightBeforeBoxed),
                                    height: parseFloat(heightBeforeBoxed),
                                    width: parseFloat(widthBeforeBoxed),
                                    length: parseFloat(lengthBeforeBoxed),
                                    weightAfterBoxing:
                                      parseFloat(weightAfterBoxed),
                                    heightAfterBoxing:
                                      parseFloat(heightAfterBoxed),
                                    widthAfterBoxing:
                                      parseFloat(widthAfterBoxed),
                                    lengthAfterBoxing:
                                      parseFloat(lengthAfterBoxed),
                                    price: productPrice,
                                    numberInStock:
                                      currentUser.storeId !== undefined
                                        ? parseFloat(productAmount)
                                        : 1,
                                    condition: chosenCondition,
                                  },
                                })
                                  .then(res => {
                                    if (res.status === 200) {
                                      setModalLoading(false);
                                      Alert.alert(
                                        'Update product successfully.',
                                        '',
                                        [
                                          {
                                            text: 'OK',
                                            onPress: () => navigation.goBack(),
                                          },
                                        ],
                                      );
                                    }
                                  })
                                  .catch(err => {
                                    console.log(err);
                                    setModalLoading(false);
                                  });
                              }
                            });
                        });
                      });
                  }
                });
            }
          });
        }
      } else {
        let listURL = [];

        listImages.forEach((image, index) => {
          firebase
            .storage()
            .ref(
              `${route.params.bucketPath}/${image.substring(
                image.lastIndexOf('/') + 1,
              )}`,
            )
            .putFile(image)
            .then(() => {
              if (index === listImages.length - 1) {
                firebase
                  .storage()
                  .ref(route.params.bucketPath)
                  .list()
                  .then(results => {
                    results.items.map((item, index) => {
                      firebase
                        .storage()
                        .ref(item.fullPath)
                        .getDownloadURL()
                        .then(url => {
                          listURL.push(url);

                          if (index === results.items.length - 1) {
                            listURL.unshift(route.params.bucketPath);

                            patchAPI({
                              url: `product/${product._id}`,
                              data: {
                                thumbnailImage: listURL[1],
                                productName: productName,
                                subcategoryId: chosenSubCategory,
                                description: productDescription,
                                categoryId: route.params.category._id,
                                detailImages: listURL,
                                video: '',
                                weight: parseFloat(weightBeforeBoxed),
                                height: parseFloat(heightBeforeBoxed),
                                width: parseFloat(widthBeforeBoxed),
                                length: parseFloat(lengthBeforeBoxed),
                                weightAfterBoxing: parseFloat(weightAfterBoxed),
                                heightAfterBoxing: parseFloat(heightAfterBoxed),
                                widthAfterBoxing: parseFloat(widthAfterBoxed),
                                lengthAfterBoxing: parseFloat(lengthAfterBoxed),
                                price: productPrice,
                                numberInStock:
                                  currentUser.storeId !== undefined
                                    ? parseFloat(productAmount)
                                    : 1,
                                condition: chosenCondition,
                              },
                            })
                              .then(res => {
                                if (res.status === 200) {
                                  setModalLoading(false);
                                  Alert.alert(
                                    'Update product successfully.',
                                    '',
                                    [
                                      {
                                        text: 'OK',
                                        onPress: () => navigation.goBack(),
                                      },
                                    ],
                                  );
                                }
                              })
                              .catch(err => {
                                console.log(err);
                                setModalLoading(false);
                              });
                          }
                        });
                    });
                  });
              }
            });
        });
      }
    } else {
      if (JSON.stringify(listImages) === JSON.stringify(product.detailImages)) {
        containImages.unshift(route.params.bucketPath);

        patchAPI({
          url: `product/${product._id}`,
          data: {
            thumbnailImage: containImages[1],
            productName: productName,
            subcategoryId: chosenSubCategory,
            description: productDescription,
            categoryId: route.params.category._id,
            detailImages: containImages,
            video: '',
            weight: parseFloat(weightBeforeBoxed),
            height: parseFloat(heightBeforeBoxed),
            width: parseFloat(widthBeforeBoxed),
            length: parseFloat(lengthBeforeBoxed),
            weightAfterBoxing: parseFloat(weightAfterBoxed),
            heightAfterBoxing: parseFloat(heightAfterBoxed),
            widthAfterBoxing: parseFloat(widthAfterBoxed),
            lengthAfterBoxing: parseFloat(lengthAfterBoxed),
            price: productPrice,
            numberInStock:
              currentUser.storeId !== undefined ? parseFloat(productAmount) : 1,
            condition: chosenCondition,
          },
        })
          .then(res => {
            if (res.status === 200) {
              setModalLoading(false);
              Alert.alert('Update product successfully.', '', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            }
          })
          .catch(err => {
            console.log(err);
            setModalLoading(false);
          });
      } else {
        let listURL = [];

        listImages.forEach((image, index) => {
          if (!containImages.includes(image)) {
            firebase
              .storage()
              .ref(
                `${route.params.bucketPath}/${image.substring(
                  image.lastIndexOf('/') + 1,
                )}`,
              )
              .putFile(image)
              .then(() => {
                if (index === listImages.length - 1) {
                  firebase
                    .storage()
                    .ref(route.params.bucketPath)
                    .list()
                    .then(results => {
                      results.items.map((item, index) => {
                        firebase
                          .storage()
                          .ref(item.fullPath)
                          .getDownloadURL()
                          .then(url => {
                            listURL.push(url);

                            if (index === results.items.length - 1) {
                              listURL.unshift(route.params.bucketPath);

                              patchAPI({
                                url: `product/${product._id}`,
                                data: {
                                  thumbnailImage: listURL[1],
                                  productName: productName,
                                  subcategoryId: chosenSubCategory,
                                  description: productDescription,
                                  categoryId: route.params.category._id,
                                  detailImages: listURL,
                                  video: '',
                                  weight: parseFloat(weightBeforeBoxed),
                                  height: parseFloat(heightBeforeBoxed),
                                  width: parseFloat(widthBeforeBoxed),
                                  length: parseFloat(lengthBeforeBoxed),
                                  weightAfterBoxing:
                                    parseFloat(weightAfterBoxed),
                                  heightAfterBoxing:
                                    parseFloat(heightAfterBoxed),
                                  widthAfterBoxing: parseFloat(widthAfterBoxed),
                                  lengthAfterBoxing:
                                    parseFloat(lengthAfterBoxed),
                                  price: productPrice,
                                  numberInStock:
                                    currentUser.storeId !== undefined
                                      ? parseFloat(productAmount)
                                      : 1,
                                  condition: chosenCondition,
                                },
                              })
                                .then(res => {
                                  if (res.status === 200) {
                                    setModalLoading(false);
                                    Alert.alert(
                                      'Update product successfully.',
                                      '',
                                      [
                                        {
                                          text: 'OK',
                                          onPress: () => navigation.goBack(),
                                        },
                                      ],
                                    );
                                  }
                                })
                                .catch(err => {
                                  console.log(err);
                                  setModalLoading(false);
                                });
                            }
                          });
                      });
                    });
                }
              });
          }
        });
      }
    }
  };

  console.log(productAmount);

  const handleUploadClick = () => {
    if (
      productName === '' ||
      productDescription === '' ||
      productPrice === '' ||
      productAmount === '' ||
      heightBeforeBoxed === '' ||
      weightBeforeBoxed === '' ||
      widthBeforeBoxed === '' ||
      lengthBeforeBoxed === '' ||
      heightAfterBoxed === '' ||
      weightAfterBoxed === '' ||
      widthAfterBoxed === '' ||
      lengthAfterBoxed === '' ||
      chosenCondition === ''
    ) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all field.',
      });
    } else {
      uploadProduct();
    }
  };

  const handleUpdateClick = () => {
    if (
      productName === '' ||
      productDescription === '' ||
      productPrice === '' ||
      productAmount === '' ||
      heightBeforeBoxed === '' ||
      weightBeforeBoxed === '' ||
      widthBeforeBoxed === '' ||
      lengthBeforeBoxed === '' ||
      heightAfterBoxed === '' ||
      weightAfterBoxed === '' ||
      widthAfterBoxed === '' ||
      lengthAfterBoxed === '' ||
      chosenCondition === '' ||
      listImages.length < 1
    ) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all field.',
      });
    } else {
      let deleteImages = [];
      let containImages = [];
      product.detailImages.forEach((image, index) => {
        !listImages.includes(image)
          ? deleteImages.push(image)
          : containImages.push(image);
        index === product.detailImages.length - 1 &&
          updateProduct(deleteImages, containImages);
      });
    }
  };

  const handleClosePicker = useCallback(() => {
    setModalPhotos(false);
  }, []);

  const handleOpenPicker = useCallback(() => {
    setModalPhotos(true);
  }, []);

  const handleListImageChange = useCallback(images => {
    setListImages(images);
  }, []);

  return !firstLoading ? (
    <SafeAreaView
      style={{
        ...globalStyles.container,
        paddingHorizontal: 0,
      }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={[
          Layout.scroll,
          Gutters.smallVPadding,
          Gutters.tinyHPadding,
        ]}
      >
        <AppText style={[Fonts.textBold, Gutters.tinyBPadding]}>
          Please choose a sub category
        </AppText>

        <AppDropDown
          open={openSubCategory}
          value={valueSubCategory}
          items={listSubCategory}
          setOpen={setOpenSubCategory}
          setValue={setValueSubCategory}
          setItems={setListSubCategory}
          placeholder={
            isEdit
              ? defaultSubCategory.subcategoryName
              : 'Select a sub category'
          }
          onSelectItem={item => setChosenSubCategory(item.value)}
        />

        <TouchableOpacity
          style={[Layout.center, Gutters.tinyTPadding]}
          disabled={listImages.length === 5}
          onPress={handleOpenPicker}
        >
          <Icon name="camera" size={64} color="black" />
          <AppText>Images: {`${listImages.length}/5`}</AppText>
        </TouchableOpacity>

        {listImages.length > 0 && (
          <ScrollView
            horizontal
            style={{
              height: 130,
              paddingVertical: 5,
              paddingLeft: 10,
            }}
          >
            {listImages.map(item => (
              <UploadImageItem onPress={getData} key={item} imageURI={item} />
            ))}
          </ScrollView>
        )}

        <AppInput
          label="Name"
          defaultValue={isEdit ? product.productName : ''}
          onChangeText={text => setProductName(text)}
        />

        <AppInput
          label="Description"
          multiline={true}
          numberOfLines={10}
          defaultValue={isEdit ? product.description : ''}
          inputStyle={{ textAlignVertical: 'top' }}
          onChangeText={text => setProductDescription(text)}
        />

        <AppInput
          label="Price (VND)"
          keyboardType="number-pad"
          defaultValue={isEdit ? product.price : ''}
          onChangeText={text => setProductPrice(text)}
        />

        {currentUser.storeId !== undefined && (
          <AppInput
            label="Number in Stock"
            keyboardType="number-pad"
            defaultValue={isEdit ? product.numberInStock.toString() : ''}
            onChangeText={text => setProductAmount(text)}
          />
        )}

        <AppText
          style={[Fonts.textBold, Gutters.tinyBPadding, Gutters.smallTPadding]}
        >
          Condition of Product
        </AppText>

        <AppDropDown
          open={openCondition}
          value={valueCondition}
          items={itemsCondition}
          setOpen={setOpenCondition}
          setValue={setValueCondition}
          setItems={setItemsCondition}
          placeholder={isEdit ? product.condition : 'Select a condition'}
          onSelectItem={item => setChosenCondition(item.value)}
        />

        <AppText style={[Fonts.textBold, Gutters.smallTPadding]}>
          Size of Product Before Boxed
        </AppText>

        <View style={[Layout.rowCenter, Layout.justifyContentAround]}>
          <AppInput
            label="Weight (gram)"
            keyboardType="number-pad"
            defaultValue={isEdit ? product.weight.toString() : ''}
            onChangeText={text => setWeightBeforeBoxed(text)}
            containerStyle={{
              width: '40%',
            }}
          />

          <AppInput
            label="Height (cm)"
            keyboardType="number-pad"
            defaultValue={isEdit ? product.height.toString() : ''}
            onChangeText={text => setHeightBeforeBoxed(text)}
            containerStyle={{
              width: '40%',
            }}
          />
        </View>

        <View style={[Layout.rowCenter, Layout.justifyContentAround]}>
          <AppInput
            label="Width (cm)"
            keyboardType="number-pad"
            defaultValue={isEdit ? product.width.toString() : ''}
            onChangeText={text => setWidthBeforeBoxed(text)}
            containerStyle={{
              width: '40%',
            }}
          />

          <AppInput
            label="Length (cm)"
            keyboardType="number-pad"
            defaultValue={isEdit ? product.length.toString() : ''}
            onChangeText={text => setLengthBeforeBoxed(text)}
            containerStyle={{
              width: '40%',
            }}
          />
        </View>

        <AppText style={[Fonts.textBold, Gutters.smallTPadding]}>
          Size of Product After Boxed
        </AppText>

        <View style={[Layout.rowCenter, Layout.justifyContentAround]}>
          <AppInput
            label="Weight (gram)"
            keyboardType="number-pad"
            defaultValue={isEdit ? product.weightAfterBoxing.toString() : ''}
            onChangeText={text => setWeightAfterBoxed(text)}
            containerStyle={{
              width: '40%',
            }}
          />

          <AppInput
            label="Height (cm)"
            keyboardType="number-pad"
            defaultValue={isEdit ? product.heightAfterBoxing.toString() : ''}
            onChangeText={text => setHeightAfterBoxed(text)}
            containerStyle={{
              width: '40%',
            }}
          />
        </View>

        <View style={[Layout.rowCenter, Layout.justifyContentAround]}>
          <AppInput
            label="Width (cm)"
            keyboardType="number-pad"
            defaultValue={isEdit ? product.widthAfterBoxing.toString() : ''}
            onChangeText={text => setWidthAfterBoxed(text)}
            containerStyle={{
              width: '40%',
            }}
          />

          <AppInput
            label="Length (cm)"
            keyboardType="number-pad"
            defaultValue={isEdit ? product.lengthAfterBoxing.toString() : ''}
            onChangeText={text => setLengthAfterBoxed(text)}
            containerStyle={{
              width: '40%',
            }}
          />
        </View>

        {isEdit ? (
          <TouchableOpacity
            onPress={handleUpdateClick}
            style={{
              ...globalStyles.button,
              alignSelf: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={globalStyles.textButton}>Update Product</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleUploadClick}
            style={[
              globalStyles.button,
              Layout.selfCenter,
              Gutters.regularTMargin,
            ]}
          >
            <AppText style={globalStyles.textButton}>Upload Product</AppText>
          </TouchableOpacity>
        )}
        <Toast position="bottom" bottomOffset={80} />
      </KeyboardAwareScrollView>

      {modalPhotos && (
        <ImagePickerBottomSheet
          onDismiss={handleClosePicker}
          listImages={listImages}
          onListImageChange={handleListImageChange}
        />
      )}

      <ModalLoading visible={modalLoading} />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={Layout.fill}>
      <ModalLoading visible={modalLoading} />
    </SafeAreaView>
  );
};

export default memo(UploadDetailScreen);
