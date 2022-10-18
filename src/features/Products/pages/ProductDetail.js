import axios from 'axios'
import React, {useLayoutEffect} from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
import {SafeAreaView, StyleSheet, Text, View} from 'react-native'
import {Avatar, Badge, Card} from 'react-native-elements'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    API_URL,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
} from '../../../components/constants'
import BottomMenuBar from '../components/BottomMenuBar'
import ModalLoading from '~/components/utils/ModalLoading'
import {Dimensions} from 'react-native'
import {Image} from 'react-native'
import {SimplePaginationDot} from '../components'
import Carousel from 'react-native-anchor-carousel'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Ion from 'react-native-vector-icons/Ionicons'
import {TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useDispatch, useSelector} from 'react-redux'
import {Alert} from 'react-native'
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

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
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
                    setModalLoading(false)
                    setRatingValue(res.data.product.rating.ratingValue)

                    res.data.product.peopleFavoriteThisProduct.forEach(id => {
                        id == currentUser._id && setFavorite(true)
                    })

                    // console.log(res.data.product)

                    axios({
                        method: 'get',
                        url: `${API_URL}/user/${res.data.product.ownerId}`,
                    }).then(res => {
                        if (res.status == 200) {
                            setProductOwner(res.data.userInfo)
                        }
                    })
                }
            })
            .catch(error => console.log(error.message))
    }, [])

    function handleCarouselScrollEnd(item, index) {
        setCurrentIndex(index)
    }

    const handleAddCartClick = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            axios({
                method: 'patch',
                url: `${API_URL}/user/addcart/${_id}`,
                headers: {
                    authorization: `Bearer ${token} `,
                },
            }).then(res => res.status == 200 && Alert.alert('Added to cart.'))
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
                    setFavorite(true)
                    dispatch(addFavorite(product))
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
                    setFavorite(false)
                    dispatch(removeFavorite(product._id))
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
            const token = await AsyncStorage.getItem('token')
            axios({
                method: 'patch',
                url: `${API_URL}/user/follow/${productOwner._id}`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
                .then(res => {
                    if (res == 200) {
                        Alert.alert('Followed')
                    }
                })
                .catch(error => console.log(error))
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
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
                <Carousel
                    data={listImages}
                    style={{
                        marginBottom: 10,
                    }}
                    initialIndex={0}
                    onScrollEnd={handleCarouselScrollEnd}
                    itemWidth={Dimensions.get('window').width * 0.88}
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
                <SimplePaginationDot
                    currentIndex={currentIndex}
                    length={listImages.length}
                />
            </View>

            <Card containerStyle={globalStyles.cardContainer}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <View>
                        <Avatar
                            rounded
                            size={'large'}
                            source={{uri: productOwner.avatar}}
                            avatarStyle={{
                                borderWidth: 1,
                                borderColor: SECONDARY_COLOR,
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
                            {productOwner.fullName}
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
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <TouchableOpacity
                            onPress={handleFollowClick}
                            style={{
                                ...styles.touchStyle,
                                backgroundColor: PRIMARY_COLOR,
                                marginRight: 5,
                            }}>
                            <Text style={{color: 'white'}}>+ Follow</Text>
                        </TouchableOpacity>
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
                </View>
            </Card>
            <Card
                containerStyle={{...globalStyles.cardContainer, marginTop: 5}}>
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
                        color: 'red',
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
                    <TouchableOpacity
                        onPress={handleAddCartClick}
                        style={styles.touchStyle}>
                        <Ion
                            name="cart-outline"
                            size={30}
                            color={PRIMARY_COLOR}
                        />
                    </TouchableOpacity>
                </View>
            </Card>
            <Card
                containerStyle={{
                    ...globalStyles.cardContainer,
                    marginTop: 5,
                }}>
                <Text>{product.description}</Text>
            </Card>
            <BottomMenuBar />
        </SafeAreaView>
    )
}

export default ProductDetail

const styles = StyleSheet.create({
    touchStyle: {
        borderRadius: 10,
        padding: 5,
    },
})
