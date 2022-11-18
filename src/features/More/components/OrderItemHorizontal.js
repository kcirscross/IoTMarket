import moment from 'moment'
import React, {useEffect, useState} from 'react'
import {Alert, Image, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {View} from 'react-native-animatable'
import {Card, Divider} from 'react-native-elements'
import Ion from 'react-native-vector-icons/Ionicons'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {getAPI, postAPI} from '../../../components/utils/base_API'

const OrderItemHorizontal = ({navigation, order, sendIndex}) => {
    const [product, setProduct] = useState([])
    const [statusDelivery, setStatusDelivery] = useState('')

    //Get Product Information
    useEffect(() => {
        getAPI({url: `product/${order.productsList[0].name}`})
            .then(res => {
                if (res.status === 200) {
                    setProduct(res.data.product)
                }
            })
            .catch(err => console.log('Get product: ', err))

        if (order.shippingLogs[0] != undefined) {
            switch (order.shippingLogs[order.shippingLogs.length - 1].status) {
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
    }, [])

    const handleConfirmReceivedClick = () => {
        Alert.alert('Confirm Received', 'Did you receive your product?', [
            {
                text: 'Yes',
                onPress: () => {
                    postAPI({url: `order/receive/${order._id}`}).then(res => {
                        if (res.status === 200) {
                            sendIndex({index: 1, reload: true})
                        }
                    })
                },
            },
            {
                text: 'Cancel',
            },
        ])
    }

    return (
        <Card
            containerStyle={{
                ...globalStyles.cardContainer,
                marginTop: 5,
            }}>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('OrderDetail', {_id: order._id})
                }>
                <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    <Image
                        source={{uri: product.thumbnailImage}}
                        style={{
                            width: 60,
                            height: 60,
                            marginRight: 10,
                            borderRadius: 10,
                        }}
                        resizeMethod="resize"
                        resizeMode="contain"
                    />

                    <View style={{flex: 1}}>
                        <Text style={{color: 'black', fontWeight: '600'}}>
                            {product.productName}
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <Text style={{color: 'black'}}>
                                {order.isCod
                                    ? 'COD'
                                    : `Giao Hang Nhanh - ${order.deliveryCode}`}
                            </Text>

                            <View style={{flex: 1}} />

                            <View>
                                <Text
                                    style={{
                                        color: 'black',
                                    }}>
                                    x{order.productsList[0].quantity}
                                </Text>

                                <Text
                                    style={{
                                        color: 'blue',
                                    }}>
                                    {Intl.NumberFormat('en-US').format(
                                        product.price,
                                    )}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Divider width={1} color={PRIMARY_COLOR} />

                <View
                    style={{
                        paddingVertical: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    {order.shippingLogs[0] != undefined && (
                        <View
                            style={{
                                flexDirection: 'row',
                                marginLeft: 4,
                                alignItems: 'center',
                            }}>
                            <Ion
                                name="ellipse"
                                size={14}
                                color={PRIMARY_COLOR}
                            />
                            <View style={{marginLeft: 16}}>
                                <Text style={{color: 'black'}}>
                                    {statusDelivery}
                                </Text>
                                <Text style={{color: 'black'}}>
                                    {moment(
                                        order.shippingLogs.update_date,
                                    ).format('HH:MM  DD - MM - YYYY ')}
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={{flex: 1}} />

                    <Text
                        style={{
                            color: 'black',
                            fontWeight: '600',
                        }}>
                        Total:{' '}
                        {Intl.NumberFormat('en-US').format(
                            order.VNPay.vnp_Amount / 100,
                        )}
                    </Text>
                </View>

                <Divider width={1} color={PRIMARY_COLOR} />

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 5,
                    }}>
                    {statusDelivery != 'Delivered' && (
                        <Text style={{color: 'black'}}>
                            Expected delivery time:
                            {moment(order.expected_delivery_time).format(
                                ' DD - MM - YYYY',
                            )}
                        </Text>
                    )}

                    <View style={{flex: 1}} />

                    {statusDelivery != 'Delivered' && (
                        <TouchableOpacity
                            onPress={handleConfirmReceivedClick}
                            style={styles.touchStyle}>
                            <Text style={globalStyles.textButton}>
                                Received
                            </Text>
                        </TouchableOpacity>
                    )}

                    {statusDelivery == 'Delivered' && (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('Review', {
                                    _id: order.productsList[0].name,
                                })
                            }
                            style={styles.touchStyle}>
                            <Text style={globalStyles.textButton}>Review</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        </Card>
    )
}

export default OrderItemHorizontal

const styles = StyleSheet.create({
    touchStyle: {
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
})
