import axios from 'axios'
import React, {useLayoutEffect} from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
import {SafeAreaView, StyleSheet, Text, View} from 'react-native'
import {Avatar, Card} from 'react-native-elements'
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
import {TouchableOpacity} from 'react-native'

const ProductDetail = ({navigation, route}) => {
    const {_id} = route.params.data
    const [product, setProduct] = useState([])
    const [productOwner, setProductOwner] = useState([])
    const [modalLoading, setModalLoading] = useState(false)
    const [listImages, setListImages] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
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
                <View
                    style={{
                        flexDirection: 'row',
                        marginRight: 5,
                    }}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: 'black',
                            fontSize: 18,
                        }}>
                        {product.productName}
                    </Text>
                    <View style={{flex: 1, justifyContent: 'center'}} />
                    <TouchableOpacity style={styles.touchStyle}>
                        <Icon
                            name="cart-plus"
                            size={24}
                            color={PRIMARY_COLOR}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{...styles.touchStyle, marginLeft: 10}}>
                        <Icon name="heart" size={24} color={PRIMARY_COLOR} />
                    </TouchableOpacity>
                </View>
                <Text>{product.description}</Text>
                <Text
                    style={{
                        color: 'red',
                        fontSize: 16,
                    }}>
                    Price: {Intl.NumberFormat('en-US').format(product.price)} đ
                </Text>
            </Card>

            <BottomMenuBar />
        </SafeAreaView>
    )
}

export default ProductDetail

const styles = StyleSheet.create({
    touchStyle: {
        borderRadius: 10,
        borderColor: '#FDA172',
        borderWidth: 1,
        padding: 5,
    },
})
