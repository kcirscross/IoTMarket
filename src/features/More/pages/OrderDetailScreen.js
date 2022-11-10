import moment from 'moment'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {Card} from 'react-native-elements'
import Toast from 'react-native-toast-message'
import Ion from 'react-native-vector-icons/Ionicons'
import {useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {getAPI, patchAPI, postAPI} from '../../../components/utils/base_API'

const OrderDetailScreen = ({navigation, route}) => {
    const [order, setOrder] = useState([])
    const [modalLoading, setModalLoading] = useState(true)
    const [statusDelivery, setStatusDelivery] = useState('')
    const [productList, setProductList] = useState([])

    const currentUser = useSelector(state => state.user)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Order Detail',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    //Get Order Information
    useEffect(() => {
        setModalLoading(true)
        getAPI({url: `order/detail/${route.params._id}`})
            .then(res => {
                if (res.status === 200) {
                    setOrder(res.data.order)

                    let shipping = res.data.order.shippingLogs

                    if (shipping[0] != undefined) {
                        switch (shipping[shipping.length - 1].status) {
                            case 'ready_to_pick':
                                setStatusDelivery('Ready to pick')
                                break

                            case 'delivered':
                                setStatusDelivery('Delivered')
                                break

                            default:
                                ''
                                break
                        }
                    }

                    let tempList = []
                    let length = res.data.order.productsList.length

                    res.data.order.productsList.map((product, index) => {
                        getAPI({url: `product/${product.name}`})
                            .then(res => {
                                if (res.status === 200) {
                                    tempList.push({
                                        product: res.data.product,
                                        quantity: product.quantity,
                                    })

                                    setProductList(tempList)

                                    index === length - 1 &&
                                        setModalLoading(false)
                                }
                            })
                            .catch(err => console.log('Get Product', err))
                    })
                }
            })
            .catch(err => console.log('Get Order: ', err))
    }, [])

    const handleAddCartClick = () => {
        productList.map((product, index) => {
            patchAPI({
                url: 'user/addcart',
                data: {
                    productId: product.product._id,
                    quantity: product.quantity,
                },
            })
                .then(
                    res =>
                        res.status === 200 &&
                        productList.length - 1 === index &&
                        navigation.navigate('Cart'),
                )
                .catch(err => {
                    console.log('Add Cart: ', err)
                    Toast.show({
                        type: 'error',
                        text1: 'Out of product, please try again later.',
                    })
                })
        })
    }

    const handleConfirmReceivedClick = () => {
        Alert.alert('Confirm Received', 'Did you receive your product?', [
            {
                text: 'Yes',
                onPress: () => {
                    postAPI({url: `order/receive/${order._id}`}).then(res => {
                        if (res.status === 200) {
                            navigation.goBack()
                        }
                    })
                },
            },
            {
                text: 'Cancel',
            },
        ])
    }

    return !modalLoading ? (
        <SafeAreaView style={globalStyles.container}>
            <ModalLoading visible={modalLoading} />

            <Toast position="bottom" bottomOffset={70} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <Card
                    containerStyle={{
                        ...globalStyles.cardContainer,
                        marginTop: 10,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ion name="bus" size={24} color={PRIMARY_COLOR} />
                        <Text
                            style={{
                                color: 'black',
                                fontWeight: '600',
                                marginLeft: 10,
                                fontSize: 16,
                            }}>
                            Delivery Information
                        </Text>
                    </View>

                    <Text style={{color: 'black', marginLeft: 34}}>
                        {order.isCod
                            ? 'COD'
                            : `Giao Hang Nhanh - ${order.deliveryCode}`}
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 4,
                            alignItems: 'center',
                        }}>
                        <Ion name="ellipse" size={14} color={PRIMARY_COLOR} />
                        <View style={{marginLeft: 16}}>
                            <Text style={{color: 'black'}}>
                                {statusDelivery}
                            </Text>
                            <Text style={{color: 'black'}}>
                                {moment(order.shippingLogs.update_date).format(
                                    'Do - MM - YYYY HH:MM',
                                )}
                            </Text>
                        </View>
                    </View>
                </Card>

                <Card
                    containerStyle={{
                        ...globalStyles.cardContainer,
                        marginTop: 5,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                        <Ion
                            name="location-outline"
                            color={PRIMARY_COLOR}
                            size={30}
                        />

                        <View style={{marginLeft: 10}}>
                            <Text style={{color: 'black', fontSize: 18}}>
                                Receive Address
                            </Text>
                            <Text
                                style={{
                                    color: 'black',
                                }}>{`\n${currentUser.fullName}  |  ${currentUser.phoneNumber}\n${currentUser.address.street}\n${currentUser.address.ward}, ${currentUser.address.district}\n${currentUser.address.city}`}</Text>
                        </View>

                        <View style={{flex: 1}} />
                    </View>
                </Card>

                <Card
                    containerStyle={{
                        ...globalStyles.cardContainer,
                        marginTop: 5,
                    }}>
                    {productList.map((item, index) => (
                        <View key={index}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}>
                                <Image
                                    source={{uri: item.product.thumbnailImage}}
                                    style={{
                                        width: 60,
                                        height: 80,
                                        borderRadius: 10,
                                    }}
                                    resizeMethod="resize"
                                    resizeMode="contain"
                                />
                                <View
                                    style={{
                                        marginVertical: 10,
                                        marginHorizontal: 10,
                                        flex: 1,
                                    }}>
                                    <Text style={{color: 'black'}}>
                                        {item.product.productName}
                                    </Text>

                                    <View style={{flex: 1}} />

                                    <View style={{flexDirection: 'row'}}>
                                        <Text>
                                            {Intl.NumberFormat('en-US').format(
                                                item.product.price,
                                            )}{' '}
                                            đ
                                        </Text>

                                        <View style={{flex: 1}} />

                                        <Text>x{item.quantity}</Text>
                                    </View>
                                </View>
                            </View>

                            {index < route.params.length - 1 && (
                                <Divider
                                    size={1}
                                    color={PRIMARY_COLOR}
                                    style={{marginVertical: 5}}
                                />
                            )}
                        </View>
                    ))}
                </Card>
            </ScrollView>

            <View
                style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    bottom: 10,
                    justifyContent: 'space-evenly',
                    width: '105%',
                }}>
                <TouchableOpacity style={styles.touchStyle}>
                    <Ion
                        name="chatbubble-ellipses-outline"
                        color="white"
                        size={24}
                    />

                    <Text style={styles.textStyle}>Contact Store</Text>
                </TouchableOpacity>

                {statusDelivery === 'Delivered' ? (
                    <TouchableOpacity
                        style={styles.touchStyle}
                        onPress={handleAddCartClick}>
                        <Ion name="cart-outline" color="white" size={24} />

                        <Text style={styles.textStyle}>Buy Again</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.touchStyle}
                        onPress={handleConfirmReceivedClick}>
                        <Ion
                            name="checkmark-done-circle-outline"
                            color="white"
                            size={24}
                        />

                        <Text style={styles.textStyle}>Received</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    ) : (
        <SafeAreaView style={globalStyles.container}>
            <ModalLoading visible={modalLoading} />
        </SafeAreaView>
    )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
    touchStyle: {
        backgroundColor: PRIMARY_COLOR,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
    },

    textStyle: {
        color: 'white',
        fontWeight: '500',
        fontSize: 18,
        marginLeft: 10,
    },
})
