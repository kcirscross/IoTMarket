import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Carousel from 'react-native-anchor-carousel'
import {Avatar, Badge, Card} from 'react-native-elements'
import Toast from 'react-native-toast-message'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Ion from 'react-native-vector-icons/Ionicons'
import {useDispatch, useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    API_URL,
    AVATAR_BORDER,
    PRIMARY_COLOR,
} from '../../../components/constants'
import {addFollow, removeFollow} from '../../Users/userSlice'
import {SimplePaginationDot} from '../components'
import BottomMenuBar from '../components/BottomMenuBar'
import {addFavorite, removeFavorite} from '../favoriteSlice'

const ProductDetail = ({navigation, route}) => {
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()

    const _id = route.params._id
    const [product, setProduct] = useState([])
    const [productOwner, setProductOwner] = useState([])
    const [modalLoading, setModalLoading] = useState(false)
    const [listImages, setListImages] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [favorite, setFavorite] = useState(false)
    const [ratingValue, setRatingValue] = useState(0)
    const [isFollow, setIsFollow] = useState(false)
    const [isOwner, setIsOwner] = useState(false)

    const [storeInfo, setStoreInfo] = useState([])
    const [isStore, setIsStore] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Detail',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
            headerRight: () => (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Favorite')}
                        style={{
                            marginRight: 5,
                        }}>
                        <Icon
                            name="heart"
                            size={24}
                            color="white"
                            solid={true}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Cart')}>
                        <Ion name="cart-outline" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            ),
        })
    }, [])

    //Get Product Detail
    useEffect(() => {
        setModalLoading(true)

        axios({
            method: 'get',
            url: `${API_URL}/product/${_id}`,
        })
            .then(res => {
                if (res.status == 200) {
                    setProduct(res.data.product)
                    setListImages(res.data.product.detailImages)
                    setRatingValue(res.data.product.rating.ratingValue)

                    res.data.product.peopleFavoriteThisProduct.forEach(id => {
                        id == currentUser._id && setFavorite(true)
                    })

                    if (
                        res.data.product.ownerId == currentUser._id ||
                        res.data.product.ownerId == currentUser.storeId
                    ) {
                        setIsOwner(true)
                    } else {
                        setIsOwner(false)
                    }

                    if (res.data.product.isStore) {
                        axios({
                            method: 'get',
                            url: `${API_URL}/store/${res.data.product.ownerId}`,
                        })
                            .then(res => {
                                setStoreInfo(res.data.store)
                                setIsStore(true)

                                //Get User Infomation
                                axios({
                                    method: 'get',
                                    url: `${API_URL}/user/${res.data.store.ownerId}`,
                                })
                                    .then(res => {
                                        if (res.status == 200) {
                                            setProductOwner(res.data.userInfo)
                                            currentUser.follows.forEach(
                                                id =>
                                                    id ==
                                                        res.data.userInfo
                                                            .storeId &&
                                                    setIsFollow(true),
                                            )
                                        }
                                        setModalLoading(false)
                                    })
                                    .catch(error => {
                                        console.log(error.response)
                                        setModalLoading(false)
                                    })
                            })
                            .catch(error => {
                                setModalLoading(false)
                                console.log(error.response)
                            })
                    } else {
                        setIsStore(false)
                        axios({
                            method: 'get',
                            url: `${API_URL}/user/${res.data.product.ownerId}`,
                        })
                            .then(res => {
                                if (res.status == 200) {
                                    setProductOwner(res.data.userInfo)
                                    currentUser.follows.forEach(
                                        id =>
                                            id == res.data.userInfo.storeId &&
                                            setIsFollow(true),
                                    )
                                }
                                setModalLoading(false)
                            })
                            .catch(error => {
                                console.log(error.response)
                                setModalLoading(false)
                            })
                    }
                }
            })
            .catch(error => {
                setModalLoading(false)
                console.log(error.response.data)
            })
    }, [])

    function handleCarouselScrollEnd(item, index) {
        setCurrentIndex(index)
    }

    const handleAddCartClick = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            axios({
                method: 'patch',
                url: `${API_URL}/user/addcart`,
                headers: {
                    authorization: `Bearer ${token} `,
                },
                data: {
                    productId: _id,
                    quantity: 1,
                },
            })
                .then(
                    res =>
                        res.status == 200 &&
                        Toast.show({
                            type: 'success',
                            text1: 'Added to cart.',
                        }),
                )
                .catch(error => console.log('Cart: ', error.response.data))
        } catch (error) {
            console.log(error)
        }
    }

    const handleFavoriteClick = async () => {
        const token = await AsyncStorage.getItem('token')

        if (!favorite) {
            try {
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/favorite/${_id}`,
                    headers: {
                        authorization: `Bearer ${token} `,
                    },
                }).then(res => {
                    if (res.status == 200) {
                        setFavorite(!favorite)
                        dispatch(addFavorite(product))

                        Toast.show({
                            type: 'success',
                            text1: 'Added to your favorite.',
                        })
                    }
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/unfavorite/${_id}`,
                    headers: {
                        authorization: `Bearer ${token} `,
                    },
                }).then(res => {
                    if (res.status == 200) {
                        setFavorite(false)
                        dispatch(removeFavorite(product._id))

                        Toast.show({
                            type: 'success',
                            text1: 'Removed from your favorite.',
                        })
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const convertTime = ms => {
        let temp = (Date.now() - ms) / 1000
        if (temp < 120) {
            return 'Just now'
        } else if (temp >= 120 && temp / 60 / 60 < 1) {
            return (temp / 60).toFixed(0) + ' minutes ago'
        } else if (temp / 60 / 60 >= 1 && temp / 60 / 60 < 2) {
            return '1 hour ago'
        } else if (temp / 60 / 60 >= 2 && temp / 60 / 60 / 24 < 1) {
            return (temp / 60 / 60).toFixed(0) + ' hours ago'
        } else if (temp / 60 / 60 / 24 >= 1 && temp / 60 / 60 / 24 < 2) {
            return '1 day ago'
        } else {
            return (temp / 60 / 60 / 24).toFixed(0) + ' days ago'
        }
    }

    const handleFollowClick = async () => {
        try {
            setModalLoading(true)
            const token = await AsyncStorage.getItem('token')
            if (!isFollow) {
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/follow/${productOwner.storeId}`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => {
                        if (res.status == 200) {
                            dispatch(addFollow(productOwner.storeId))

                            Toast.show({
                                type: 'success',
                                text1: 'Followed',
                            })

                            setIsFollow(true)
                            setModalLoading(false)
                        }
                    })
                    .catch(error => console.log(error))
            } else {
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/unfollow/${productOwner.storeId}`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => {
                        if (res.status == 200) {
                            dispatch(removeFollow(productOwner.storeId))

                            Toast.show({
                                type: 'success',
                                text1: 'Unfollowed',
                            })
                            setModalLoading(false)
                            setIsFollow(false)
                        }
                    })
                    .catch(error => console.log(error))
            }
        } catch (error) {
            console.log(error)
            setModalLoading(false)
        }
    }

    return !modalLoading ? (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                opacity: modalLoading ? 0.5 : 1,
            }}>
            <ModalLoading visible={modalLoading} />

            <View
                style={{
                    height: 300,
                    marginBottom: 10,
                }}>
                {listImages.length == 1 ? (
                    <View>
                        <Image
                            source={{uri: listImages[0]}}
                            resizeMethod="scale"
                            resizeMode="contain"
                            style={{
                                width: '100%',
                                height: 250,
                                borderRadius: 10,
                                elevation: 3,
                                marginVertical: 10,
                            }}
                        />
                    </View>
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
                        onSnapToItem={index => setIndex(index)}
                        renderItem={({item}) => (
                            <Image
                                source={{
                                    uri: item,
                                }}
                                resizeMethod="scale"
                                resizeMode="contain"
                                style={{
                                    width: '100%',
                                    height: 250,
                                    borderRadius: 10,
                                    elevation: 3,
                                }}
                            />
                        )}
                    />
                )}
                <SimplePaginationDot
                    currentIndex={currentIndex}
                    length={listImages.length}
                />
            </View>

            <Toast position="bottom" bottomOffset={70} />

            <Card containerStyle={globalStyles.cardContainer}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('Profile', productOwner)
                    }>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <View>
                            <Avatar
                                rounded
                                size={'large'}
                                source={{
                                    uri: isStore
                                        ? storeInfo.shopImage
                                        : productOwner.avatar,
                                }}
                                avatarStyle={{
                                    borderWidth: 1,
                                    borderColor: AVATAR_BORDER,
                                }}
                            />

                            <Badge
                                value=" "
                                status={
                                    productOwner.onlineStatus == 'Online'
                                        ? 'success'
                                        : 'warning'
                                }
                                containerStyle={{
                                    position: 'absolute',
                                    bottom: 2,
                                    right: 5,
                                }}
                            />
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: 'black',
                                    marginLeft: 10,
                                    fontSize: 18,
                                }}>
                                {isStore
                                    ? storeInfo.displayName
                                    : productOwner.fullName}
                            </Text>
                            <Text style={{color: 'black', marginLeft: 10}}>
                                {productOwner.onlineStatus == 'Online'
                                    ? 'Online'
                                    : convertTime(
                                          Date.parse(productOwner.updatedAt),
                                      )}
                            </Text>
                        </View>
                        <View style={{flex: 1}} />
                        {!isOwner && (
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                {isStore && (
                                    <TouchableOpacity
                                        onPress={handleFollowClick}
                                        style={{
                                            ...styles.touchStyle,
                                            backgroundColor: isFollow
                                                ? 'red'
                                                : PRIMARY_COLOR,
                                            marginRight: 5,
                                        }}>
                                        {isFollow ? (
                                            <Text style={{color: 'white'}}>
                                                - Follow
                                            </Text>
                                        ) : (
                                            <Text style={{color: 'white'}}>
                                                + Follow
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={{
                                        ...styles.touchStyle,
                                        backgroundColor: PRIMARY_COLOR,
                                        marginRight: 5,
                                        flexDirection: 'row',
                                        marginTop: 5,
                                    }}>
                                    <Ion
                                        name="chatbubble-ellipses-outline"
                                        size={18}
                                        color="white"
                                    />
                                    <Text style={{color: 'white'}}> Chat</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Card>

            <Card
                containerStyle={{
                    ...globalStyles.cardContainer,
                    marginTop: 5,
                }}>
                <Text
                    style={{
                        fontWeight: 'bold',
                        color: 'black',
                        fontSize: 20,
                    }}>
                    {product.productName}
                </Text>

                <Text
                    style={{
                        color: 'blue',
                        fontSize: 18,
                    }}>
                    Price: {Intl.NumberFormat('en-US').format(product.price)} đ
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                        name="star"
                        size={15}
                        color="#FA8128"
                        solid={1 <= ratingValue}
                    />
                    <Icon
                        name="star"
                        size={15}
                        color="#FA8128"
                        solid={2 <= ratingValue}
                    />
                    <Icon
                        name="star"
                        size={15}
                        color="#FA8128"
                        solid={3 <= ratingValue}
                    />
                    <Icon
                        name="star"
                        size={15}
                        color="#FA8128"
                        solid={4 <= ratingValue}
                    />
                    <Icon
                        name="star"
                        size={15}
                        color="#FA8128"
                        solid={5 <= ratingValue}
                    />
                    <Text
                        style={{
                            color: 'black',
                            fontSize: 16,
                            marginLeft: 5,
                        }}>
                        {ratingValue} | Sold:{' '}
                        {Intl.NumberFormat('en-US').format(product.soldCount)}
                    </Text>
                    <View style={{flex: 1}} />

                    {!isOwner && (
                        <TouchableOpacity
                            onPress={handleFavoriteClick}
                            style={{...styles.touchStyle}}>
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
                            style={styles.touchStyle}>
                            <Ion
                                name="cart-outline"
                                size={30}
                                color={PRIMARY_COLOR}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </Card>

            <Card
                containerStyle={{
                    ...globalStyles.cardContainer,
                    marginTop: 5,
                }}>
                <View style={styles.viewStyle}>
                    <Text style={styles.textStyle}>Condition: </Text>
                    <Text>{product.condition}</Text>
                </View>
                <View style={styles.viewStyle}>
                    <Text style={styles.textStyle}>Description: </Text>
                    <Text>{product.description}</Text>
                </View>
            </Card>

            {!isOwner && <BottomMenuBar productOwner={productOwner} />}
        </SafeAreaView>
    ) : (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                opacity: modalLoading ? 0.5 : 1,
            }}>
            <ModalLoading visible={modalLoading} />
        </SafeAreaView>
    )
}

export default ProductDetail

const styles = StyleSheet.create({
    touchStyle: {
        borderRadius: 10,
        padding: 5,
    },
    textStyle: {color: 'black', fontSize: 16},
    viewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
