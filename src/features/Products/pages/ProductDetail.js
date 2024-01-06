/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import { firebase } from '@react-native-firebase/messaging';
import { useIsFocused } from '@react-navigation/native';
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
  Dimensions,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-anchor-carousel';
import { Avatar, Badge, Card, Divider, Rating } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-toast-message';
import Ant from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ion from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import ModalLoading from '~/components/utils/ModalLoading';

import { Gutters, Layout, globalStyles } from '@/assets/styles';
import {
  AppImage,
  AppScalableImage,
  AppText,
} from '@/components/GlobalComponents';
import {
  API_URL,
  AVATAR_BORDER,
  AlertForSignIn,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  convertTime,
} from '@/components/constants';
import { deleteAPI, getAPI, patchAPI } from '@/components/utils/base_API';
import { addFollow, removeFollow } from '@/features/Users/userSlice';
import {
  ProductItem,
  ReviewItemHorizontal,
  SimplePaginationDot,
} from '../components';
import BottomMenuBar from '../components/BottomMenuBar';
import { addFavorite, removeFavorite } from '../favoriteSlice';

const ProductDetail = ({ navigation, route }) => {
  const currentUser = useSelector(state => state.user);
  const dispatch = useDispatch();

  const _id = route.params._id;
  const [product, setProduct] = useState([]);
  const [productOwner, setProductOwner] = useState([]);
  const [modalLoading, setModalLoading] = useState(true);
  const [listImages, setListImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [rating, setRating] = useState({});
  const [isFollow, setIsFollow] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [storeInfo, setStoreInfo] = useState([]);
  const [isStore, setIsStore] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [modalBuyVisible, setModalBuyVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [miniListReview, setMiniListReview] = useState([]);
  const [listReview, setListReview] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [bucketPath, setBucketPath] = useState('');
  const isFocus = useIsFocused();
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Detail',
      headerStyle: { backgroundColor: PRIMARY_COLOR },
      headerTintColor: 'white',
      headerShown: true,
      headerBackTitleStyle: {
        color: 'white',
      },
      headerRight: () => (
        <View style={Layout.rowHCenter}>
          {!isOwner && (
            <TouchableOpacity
              onPress={() => {
                Object.keys(currentUser).length !== 0
                  ? navigation.navigate('Favorite')
                  : AlertForSignIn({ navigation });
              }}
              style={{
                marginRight: 5,
              }}
            >
              <Icon name="heart" size={24} color="white" solid={true} />
            </TouchableOpacity>
          )}

          {!isOwner && (
            <TouchableOpacity
              onPress={() => {
                Object.keys(currentUser).length !== 0
                  ? navigation.navigate('Cart')
                  : AlertForSignIn({ navigation });
              }}
            >
              <Ion name="cart-outline" size={30} color="white" />
            </TouchableOpacity>
          )}

          {isOwner && (
            <TouchableOpacity onPress={() => setModalEdit(true)}>
              <Material name="more-vert" size={30} color="white" />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [isOwner]);

  //Get Product Detail
  useEffect(() => {
    getProduct();

    getReview();
  }, [isFocus]);

  const getProduct = () => {
    setModalLoading(true);

    axios({
      method: 'get',
      url: `${API_URL}/product/${_id}`,
    })
      .then(res => {
        if (res.status === 200) {
          setProduct(res.data.product);

          setBucketPath(res.data.product.detailImages.shift());
          setListImages(res.data.product.detailImages);

          setRating(res.data.product.rating);

          getAPI({
            url: `product/category/${res.data.product.categoryId}`,
          }).then(
            res => res.status === 200 && setListProduct(res.data.products),
          );

          res.data.product.peopleFavoriteThisProduct.forEach(id => {
            id === currentUser._id && setFavorite(true);
          });

          if (
            res.data.product.ownerId === currentUser._id ||
            res.data.product.ownerId === currentUser.storeId
          ) {
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }

          if (res.data.product.isStore) {
            axios({
              method: 'get',
              url: `${API_URL}/store/${res.data.product.ownerId}`,
            })
              .then(res => {
                setStoreInfo(res.data.store);
                setIsStore(true);

                //Get User Information
                axios({
                  method: 'get',
                  url: `${API_URL}/user/${res.data.store.ownerId}`,
                })
                  .then(res => {
                    if (res.status === 200) {
                      setProductOwner(res.data.userInfo);
                      currentUser.follows.forEach(
                        id =>
                          id === res.data.userInfo.storeId && setIsFollow(true),
                      );
                    }
                  })
                  .then(() => setModalLoading(false))
                  .catch(error => {
                    console.log(error.response);
                    setModalLoading(false);
                  });
              })
              .catch(error => {
                setModalLoading(false);
                console.log(error.response);
              });
          } else {
            setIsStore(false);
            axios({
              method: 'get',
              url: `${API_URL}/user/${res.data.product.ownerId}`,
            })
              .then(res => {
                if (res.status === 200) {
                  setProductOwner(res.data.userInfo);
                  currentUser.follows.forEach(
                    id => id === res.data.userInfo.storeId && setIsFollow(true),
                  );
                  setModalLoading(false);
                }
              })
              .catch(error => {
                console.log(error.response);
                setModalLoading(false);
              });
          }
        }
      })
      .catch(error => {
        setModalLoading(false);
        console.log(error.response.data);
      });
  };

  const getReview = () => {
    setModalLoading(true);
    getAPI({ url: `review/${_id}` })
      .then(res => {
        if (res.status === 200) {
          setMiniListReview([
            res.data.reviews[0],
            res.data.reviews[1],
            res.data.reviews[2],
          ]);

          setListReview(res.data.reviews);

          setModalLoading(false);
        }
      })
      .catch(err => console.log('Get Reviews: ', err));
  };

  const onRefresh = () => {
    getProduct();
    getReview();

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  function handleCarouselScrollEnd(item, index) {
    setCurrentIndex(index);
  }

  const handleAddCartClick = () => {
    Object.keys(currentUser).length !== 0
      ? patchAPI({
          url: 'user/addcart',
          data: {
            productId: _id,
            quantity: 1,
          },
        })
          .then(
            res =>
              res.status === 200 &&
              Toast.show({
                type: 'success',
                text1: 'Added to cart.',
              }),
          )
          .catch(err => console.log('Add Cart: ', err))
      : AlertForSignIn({ navigation });
  };

  const handleFavoriteClick = () => {
    Object.keys(currentUser).length !== 0
      ? !favorite
        ? patchAPI({ url: `user/favorite/${_id}` })
            .then(res => {
              if (res.status === 200) {
                setFavorite(!favorite);

                Toast.show({
                  type: 'success',
                  text1: 'Added to your favorite.',
                });

                dispatch(addFavorite(product));
              }
            })
            .catch(err => console.log('Add Favorite: ', err))
        : patchAPI({ url: `user/unfavorite/${_id}` })
            .then(res => {
              if (res.status === 200) {
                setFavorite(false);

                Toast.show({
                  type: 'success',
                  text1: 'Removed from your favorite.',
                });

                dispatch(removeFavorite(product._id));
              }
            })
            .catch(err => console.log('Remove Favorite: ', err))
      : AlertForSignIn({ navigation });
  };

  const handleFollowClick = () => {
    Object.keys(currentUser) !== 0
      ? !isFollow
        ? patchAPI({ url: `user/follow/${productOwner.storeId}` })
            .then(res => {
              if (res.status === 200) {
                setIsFollow(true);

                Toast.show({
                  type: 'success',
                  text1: 'Followed',
                });

                dispatch(addFollow(productOwner.storeId));
              }
            })
            .catch(err => console.log('Follow: ', err))
        : patchAPI({ url: `unfollow/${productOwner.storeId}` })
            .then(res => {
              if (res.status === 200) {
                setIsFollow(false);

                Toast.show({
                  type: 'success',
                  text1: 'Unfollowed',
                });

                dispatch(removeFollow(productOwner.storeId));
              }
            })
            .catch(err => console.log('Unfollow: ', err))
      : AlertForSignIn({ navigation });
  };

  const setVisible = isVisible => {
    setModalBuyVisible(isVisible);
  };

  const handleDeleteClick = () => {
    Alert.alert('Delete this product?', '', [
      {
        text: 'Yes',
        onPress: () => {
          setModalLoading(true);
          deleteAPI({ url: `product/${product._id}` })
            .then(async res => {
              if (res.status === 200) {
                await firebase
                  .storage()
                  .ref(bucketPath)
                  .list()
                  .then(result => {
                    result.items.forEach(item => console.log(item.delete()));
                  })
                  .then(() => {
                    setModalLoading(false);
                    navigation.goBack();
                  });
              }
            })
            .catch(err => console.log('Delete:', err));
        },
      },
      {
        text: 'No',
      },
    ]);
  };

  const handleEditClick = () => {
    getAPI({ url: 'category' })
      .then(res => {
        if (res.status === 200) {
          res.data.categories.forEach(category => {
            category._id === product.categoryId &&
              navigation.navigate('UploadDetail', {
                category: category,
                isEdit: true,
                product: product,
                bucketPath: bucketPath,
              });
          });
          setModalEdit(false);
        }
      })
      .catch(err => console.log('Get Sub: ', err));
  };

  const handleCloseImageFullscreen = useCallback(() => {
    setIsImageFullscreen(false);
  }, []);

  return !modalLoading ? (
    <SafeAreaView
      style={{
        ...globalStyles.container,
        opacity: modalLoading ? 0.3 : 1,
        paddingHorizontal: 0,
      }}
    >
      <ModalLoading visible={modalLoading} />

      <AppScalableImage
        images={[{ uri: listImages[0] }]}
        imageIndex={currentIndex}
        visible={isImageFullscreen}
        onRequestClose={handleCloseImageFullscreen}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[Layout.scroll, Gutters.tinyHPadding]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {listImages.length === 1 ? (
          <TouchableOpacity onPress={() => setIsImageFullscreen(true)}>
            <AppImage
              source={{ uri: listImages[0] }}
              style={styles.imageStyle}
            />
          </TouchableOpacity>
        ) : (
          <Carousel
            autoplay={true}
            lockScrollWhileSnapping={true}
            autoplayInterval={1000}
            data={listImages}
            style={{
              marginBottom: 10,
            }}
            initialIndex={0}
            onScrollEnd={handleCarouselScrollEnd}
            itemWidth={Dimensions.get('window').width * 0.95}
            containerWidth={Dimensions.get('window').width * 0.95}
            separatorWidth={2}
            inActiveOpacity={0.5}
            onSnapToItem={index => setCurrentIndex(index)}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setCurrentIndex(index);
                  setIsImageFullscreen(true);
                }}
              >
                <AppImage
                  source={{
                    uri: item,
                  }}
                  style={styles.imageStyle}
                />
              </TouchableOpacity>
            )}
          />
        )}
        <SimplePaginationDot
          currentIndex={currentIndex}
          length={listImages.length}
        />

        <Card
          containerStyle={{
            ...globalStyles.cardContainer,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('StoreProfile', {
                store: storeInfo,
                ownerInfo: productOwner,
              })
            }
          >
            <View style={Layout.rowHCenter}>
              <View>
                <Avatar
                  rounded
                  size={'medium'}
                  source={{
                    uri: isStore ? storeInfo.shopImage : productOwner.avatar,
                  }}
                  avatarStyle={{
                    borderWidth: 1,
                    borderColor: AVATAR_BORDER,
                  }}
                />

                <Badge
                  value=" "
                  status={
                    productOwner.onlineStatus === 'Online'
                      ? 'success'
                      : 'warning'
                  }
                  containerStyle={[
                    Layout.absolute,
                    Layout.right0,
                    {
                      bottom: -2,
                    },
                  ]}
                />
              </View>

              <View style={Layout.fill}>
                <AppText
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontWeight: 'bold',
                    marginLeft: 10,
                  }}
                >
                  {isStore ? storeInfo.displayName : productOwner.fullName}
                </AppText>

                <AppText style={{ marginLeft: 10 }}>
                  {productOwner.onlineStatus === 'Online'
                    ? 'Online'
                    : convertTime(Date.parse(productOwner.updatedAt))}
                </AppText>
              </View>

              {!isOwner && (
                <View style={Layout.center}>
                  {isStore && (
                    <TouchableOpacity
                      onPress={handleFollowClick}
                      style={{
                        ...styles.touchStyle,
                        borderColor: isFollow ? 'red' : PRIMARY_COLOR,
                        marginRight: 5,
                        borderWidth: 1,
                      }}
                    >
                      {isFollow ? (
                        <View style={Layout.rowHCenter}>
                          <Ant name="minuscircleo" size={14} color="red" />
                          <AppText
                            style={{
                              color: 'red',
                              marginLeft: 5,
                            }}
                          >
                            Follow
                          </AppText>
                        </View>
                      ) : (
                        <View style={Layout.rowHCenter}>
                          <Ant
                            name="pluscircleo"
                            size={14}
                            color={PRIMARY_COLOR}
                          />
                          <AppText
                            style={{
                              color: PRIMARY_COLOR,
                              marginLeft: 5,
                            }}
                          >
                            Follow
                          </AppText>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Card>

        <Card
          containerStyle={{
            ...globalStyles.cardContainer,
            marginTop: 12,
          }}
        >
          <AppText
            style={{
              fontWeight: 'bold',
              fontSize: 20,
            }}
          >
            {product.productName}
          </AppText>

          <AppText
            style={{
              color: 'blue',
              fontSize: 18,
            }}
          >
            Price: {Intl.NumberFormat('en-US').format(product.price)} đ
          </AppText>

          <View style={Layout.rowHCenter}>
            <Rating
              type="custom"
              readonly
              startingValue={rating.ratingValue}
              imageSize={16}
              ratingColor="#FA8128"
              fractions={false}
            />

            <AppText
              style={{
                marginLeft: 5,
              }}
            >
              {rating.ratingValue} | Sold:{' '}
              {Intl.NumberFormat('en-US').format(product.soldCount)}
            </AppText>

            <View style={Layout.fill} />

            {!isOwner && (
              <TouchableOpacity
                onPress={handleFavoriteClick}
                style={{ ...styles.touchStyle }}
              >
                <Icon
                  name="heart"
                  size={24}
                  color={favorite ? 'red' : PRIMARY_COLOR}
                  solid={favorite}
                />
              </TouchableOpacity>
            )}

            {!isOwner && (
              <TouchableOpacity
                onPress={handleAddCartClick}
                style={styles.touchStyle}
              >
                <Ion name="cart-outline" size={30} color={PRIMARY_COLOR} />
              </TouchableOpacity>
            )}
          </View>
        </Card>

        <Card
          containerStyle={{
            ...globalStyles.cardContainer,
            marginTop: 12,
          }}
        >
          <View style={styles.viewStyle}>
            <AppText>Condition: </AppText>
            <AppText
              style={{
                color:
                  product.condition === 'New'
                    ? PRIMARY_COLOR
                    : product.condition === 'Used - Like New'
                    ? 'green'
                    : product.condition === 'Used - Good'
                    ? '#ffbf00'
                    : 'orange',
                fontWeight: 'bold',
              }}
            >
              {product.condition}
            </AppText>
          </View>

          <View style={styles.viewStyle}>
            <AppText>Number in stock: </AppText>
            <AppText>{product.numberInStock}</AppText>
          </View>
        </Card>

        <Card
          containerStyle={{
            ...globalStyles.cardContainer,
            marginTop: 12,
          }}
        >
          <AppText>{product.description}</AppText>
        </Card>

        <Card
          containerStyle={{
            ...globalStyles.cardContainer,
            marginTop: 12,
          }}
        >
          <View
            style={[
              Layout.rowCenter,
              Layout.justifyContentAround,
              {
                marginBottom: 5,
              },
            ]}
          >
            <View style={Layout.alignItemsCenter}>
              <AppText
                style={{
                  fontWeight: '700',
                  fontSize: 20,
                  marginVertical: 10,
                }}
              >
                {rating.ratingValue}
              </AppText>

              <Rating
                type="custom"
                readonly
                startingValue={rating.ratingValue}
                imageSize={20}
                ratingColor="#FA8128"
                fractions={false}
              />

              <AppText>{`(${Intl.NumberFormat('en-US').format(
                rating.ratingCount,
              )} reviews)`}</AppText>
            </View>

            <Divider orientation="vertical" color={PRIMARY_COLOR} width={1} />

            {rating !== undefined && (
              <View>
                <View style={Layout.rowHCenter}>
                  <AppText
                    style={{
                      marginRight: 10,
                    }}
                  >
                    5
                  </AppText>
                  <Progress.Bar
                    animated={false}
                    progress={rating.fiveStarCount / rating.ratingCount || 0}
                    color={PRIMARY_COLOR}
                    unfilledColor={SECONDARY_COLOR}
                    borderColor="white"
                    useNativeDriver={true}
                  />
                </View>

                <View style={Layout.rowHCenter}>
                  <AppText
                    style={{
                      marginRight: 10,
                    }}
                  >
                    4
                  </AppText>
                  <Progress.Bar
                    animated={false}
                    progress={rating.fourStarCount / rating.ratingCount || 0}
                    color={PRIMARY_COLOR}
                    unfilledColor={SECONDARY_COLOR}
                    borderColor="white"
                  />
                </View>

                <View style={Layout.rowHCenter}>
                  <AppText
                    style={{
                      marginRight: 10,
                    }}
                  >
                    3
                  </AppText>
                  <Progress.Bar
                    animated={false}
                    progress={rating.threeStarCount / rating.ratingCount || 0}
                    color={PRIMARY_COLOR}
                    unfilledColor={SECONDARY_COLOR}
                    borderColor="white"
                  />
                </View>

                <View style={Layout.rowHCenter}>
                  <AppText
                    style={{
                      marginRight: 10,
                    }}
                  >
                    2
                  </AppText>

                  <Progress.Bar
                    animated={false}
                    progress={rating.twoStarCount / rating.ratingCount || 0}
                    color={PRIMARY_COLOR}
                    unfilledColor={SECONDARY_COLOR}
                    borderColor="white"
                  />
                </View>

                <View style={Layout.rowHCenter}>
                  <AppText
                    style={{
                      marginRight: 10,
                    }}
                  >
                    1
                  </AppText>
                  <Progress.Bar
                    animated={false}
                    progress={rating.oneStarCount / rating.ratingCount || 0}
                    height={10}
                    color={PRIMARY_COLOR}
                    unfilledColor={SECONDARY_COLOR}
                    borderColor="white"
                  />
                </View>
              </View>
            )}
          </View>

          <Divider width={1} color={PRIMARY_COLOR} />

          {listReview.length < 4
            ? miniListReview.map((review, index) => (
                <ReviewItemHorizontal
                  key={index}
                  navigation={navigation}
                  review={review}
                />
              ))
            : listReview.map((review, index) => (
                <ReviewItemHorizontal
                  key={index}
                  navigation={navigation}
                  review={review}
                />
              ))}

          {rating.ratingCount > 3 && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AllReview', {
                  listReview,
                })
              }
              style={[
                Layout.rowCenter,
                {
                  marginTop: 10,
                },
              ]}
            >
              <AppText
                style={[
                  Layout.selfCenter,
                  {
                    color: PRIMARY_COLOR,
                  },
                ]}
              >
                See all {rating.ratingCount} reviews.
              </AppText>

              <Ion
                name="chevron-forward-outline"
                size={20}
                color="black"
                style={[Layout.absolute, { right: 10 }]}
              />
            </TouchableOpacity>
          )}
        </Card>

        {listProduct.length > 0 && (
          <View
            style={{
              paddingBottom: 60,
              paddingTop: 12,
            }}
          >
            <AppText
              style={{
                fontWeight: '700',
                fontSize: 18,
              }}
            >
              Products In Same Category
            </AppText>

            <ScrollView
              horizontal
              contentContainerStyle={Layout.scroll}
              showsHorizontalScrollIndicator={false}
            >
              {listProduct.map((item, index) => (
                <ProductItem navigation={navigation} key={index} data={item} />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <Toast position="bottom" bottomOffset={70} />

      <Modal visible={modalEdit} animationType="none" transparent={true}>
        <Card containerStyle={styles.modalEdit}>
          <TouchableOpacity onPress={handleEditClick} style={styles.touchEdit}>
            <AppText style={styles.textEdit}>Edit</AppText>
            <Material name="edit" size={20} color="black" />
          </TouchableOpacity>

          <Divider color={PRIMARY_COLOR} size={2} />

          <TouchableOpacity
            style={styles.touchEdit}
            onPress={handleDeleteClick}
          >
            <AppText style={{ ...styles.textEdit, color: 'red' }}>
              Delete
            </AppText>
            <Material name="delete-outline" size={20} color="red" />
          </TouchableOpacity>
        </Card>
      </Modal>

      {!isOwner && (
        <BottomMenuBar
          navigation={navigation}
          onPress={setVisible}
          productOwner={productOwner}
          product={product}
        />
      )}
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

export default memo(ProductDetail);

const styles = StyleSheet.create({
  touchStyle: {
    borderRadius: 10,
    padding: 5,
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: Dimensions.get('window').width - 20,
    height: 250,
    borderRadius: 10,
    marginVertical: 10,
  },
  modalEdit: {
    ...globalStyles.cardContainer,
    position: 'absolute',
    top: '9%',
    right: '2%',
    width: 120,
    flex: 1,
  },
  touchEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  textEdit: {
    fontWeight: '500',
    fontSize: 16,
  },
});
