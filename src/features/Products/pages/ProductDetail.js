import axios from 'axios'
import React, { useLayoutEffect } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { Avatar, Card } from 'react-native-elements'
import { globalStyles } from '../../../assets/styles/globalStyles'
import {
    API_URL,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
} from '../../../components/constants'
import BottomMenuBar from '../components/BottomMenuBar'
import ModalLoading from '~/components/utils/ModalLoading'
import { Dimensions } from 'react-native'
import { Image } from 'react-native'
import { SimplePaginationDot } from '../components'
import Carousel from 'react-native-anchor-carousel'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ProductDetail = ({ navigation, route }) => {
    const { _id } = route.params.data
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
            headerStyle: { backgroundColor: PRIMARY_COLOR },
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
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

                    console.log(res.data.product)

                    // axios({
                    //     method: 'get',
                    //     url: `${API_URL}/user/${res.data.product.ownerId}`,
                    // }).then(res => {
                    //     if (res.status == 200) {
                    //         // setProductOwner(res.data)
                    //         console.log(res.data)
                    //     }
                    // })
                }
            })
            .catch(error => console.log(error.message))
    }, [])

    function handleCarouselScrollEnd(item, index) {
        setCurrentIndex(index)
    }

    const handleAddCartClick = () => {
        axios({
            method: '',
            url: `${API_URL}/`,
        })
    }

    const handleFavoriteClick = async () => {
        const token = await AsyncStorage.getItem('token')

        if (!favorite) {
            try {
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/favorite/${_id}`,
                    headers: {
                        authorization: `Bearer ${token} `
                    }
                }).then(res => {
                    setFavorite(true)
                    console.log(res.data)
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
                        authorization: `Bearer ${token} `
                    }
                }).then(res => {
                    setFavorite(false)
                    console.log(res.data)
                })
            } catch (error) {
                console.log(error)
            }
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
                    renderItem={({ item }) => (
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

            {/* <Card containerStyle={globalStyles.cardContainer}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <Avatar
                        rounded
                        size={64}
                        source={require('~/assets/images/logo.jpg')}
                    />
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: 'black',
                            marginLeft: 10,
                        }}>
                        {productDisplayName}
                    </Text>
                </View>
            </Card> */}
            <Card containerStyle={globalStyles.cardContainer}>
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name='star' size={15} color='#FA8128' solid={1 <= ratingValue} />
                    <Icon name='star' size={15} color='#FA8128' solid={2 <= ratingValue} />
                    <Icon name='star' size={15} color='#FA8128' solid={3 <= ratingValue} />
                    <Icon name='star' size={15} color='#FA8128' solid={4 <= ratingValue} />
                    <Icon name='star' size={15} color='#FA8128' solid={5 <= ratingValue} />
                    <Text style={{
                        color: 'black',
                        fontSize: 16,
                        marginLeft: 5
                    }}>{ratingValue}   |   Sold: {Intl.NumberFormat('en-US').format(product.soldCount)}</Text>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                        onPress={handleFavoriteClick}
                        style={{ ...styles.touchStyle, }}>
                        <Icon name="heart" size={24} color={favorite ? 'red' : PRIMARY_COLOR} solid={favorite} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleAddCartClick}
                        style={styles.touchStyle}>
                        <Icon
                            name="cart-plus"
                            size={24}
                            color={PRIMARY_COLOR}
                        />
                    </TouchableOpacity>

                </View>
            </Card>
            <Card containerStyle={{
                ...globalStyles.cardContainer,
                marginTop: 5
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
