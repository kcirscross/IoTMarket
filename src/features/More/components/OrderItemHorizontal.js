import moment from 'moment'
import React, {useEffect, useState} from 'react'
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {View} from 'react-native-animatable'
import {Card, Divider} from 'react-native-elements'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {getAPI} from '../../../components/utils/base_API'

const OrderItemHorizontal = ({navigation, order}) => {
    const [product, setProduct] = useState([])

    //Get Product Information
    useEffect(() => {
        getAPI({url: `product/${order.productsList[0].name}`})
            .then(res => setProduct(res.data.product))
            .catch(err => console.log('Get product: ', err))
    }, [])
    // console.log(order)
    return (
        <Card containerStyle={{...globalStyles.cardContainer, marginTop: 5}}>
            <TouchableOpacity>
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
                        <Text style={{alignSelf: 'flex-end', color: 'black'}}>
                            x{order.productsList[0].quantity}
                        </Text>
                        <Text style={{alignSelf: 'flex-end', color: 'blue'}}>
                            {Intl.NumberFormat('en-US').format(product.price)}
                        </Text>
                    </View>
                </View>

                <Divider width={1} color={PRIMARY_COLOR} />

                <View style={{paddingVertical: 5}}>
                    <Text
                        style={{
                            color: 'black',
                            alignSelf: 'flex-end',
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
                    <Text style={{color: 'black'}}>
                        Expected delivery time:
                        {moment(order.expected_delivery_time).format(
                            ' Do - MM - YYYY',
                        )}
                    </Text>

                    <View style={{flex: 1}} />

                    <TouchableOpacity
                        style={{
                            backgroundColor: PRIMARY_COLOR,
                            padding: 10,
                            borderRadius: 10,
                        }}>
                        <Text style={globalStyles.textButton}>Received</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Card>
    )
}

export default OrderItemHorizontal

const styles = StyleSheet.create({})
