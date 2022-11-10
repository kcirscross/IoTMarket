import {useIsFocused} from '@react-navigation/native'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {Alert} from 'react-native'
import {
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {Card, Divider} from 'react-native-elements'
import Ion from 'react-native-vector-icons/Ionicons'
import {useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {postAPI} from '../../../components/utils/base_API'

const PaymentCartScreen = ({navigation, route}) => {
    const currentUser = useSelector(state => state.user)

    const [modalDeliveryVisible, setModalDeliveryVisible] = useState(false)
    const [deleveryFee, setDeleveryFee] = useState(0)
    const [deleveryMethod, setDeleveryMethod] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const isFocus = useIsFocused()
    const [totalCost, setTotalCost] = useState(0)
    const [listOrder, setListOrder] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Payment',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    //Get Delivery Fee
    useEffect(() => {
        let tempList = []
        route.params.map((order, index) => {
            tempList.push({
                productId: order.product._id,
                quantity: order.quantity,
            })

            if (index == route.params.length - 1) {
                setModalLoading(true)
                setListOrder(tempList)
                postAPI({
                    url: 'shipping/calculate',
                    data: tempList,
                })
                    .then(res => {
                        if (res.status === 200) {
                            setDeleveryFee(res.data.totalShippingFee)
                            setTotalCost(res.data.totalProductCost)
                            setModalLoading(false)
                        }
                    })
                    .catch(err => console.log('Get Delivery Fee: ', err))
            }
        })
    }, [isFocus])

    const handlePaymentClick = () => {
        if (deleveryMethod) {
            Alert.alert(
                'Confirm Order',
                'You will pay when received product.',
                [
                    {
                        text: 'Yes',
                        onPress: () => {
                            setModalLoading(true)

                            postAPI({
                                url: 'user/buy',
                                params: {
                                    isCodQuery: true,
                                },
                                data: listOrder,
                            })
                                .then(res => {
                                    if (res.status === 200) {
                                        setModalLoading(false)
                                        navigation.replace('Order')
                                    }
                                })
                                .catch(err => console.log('Payment: ', err))
                        },
                    },
                    {
                        text: 'Cancel',
                    },
                ],
            )
        } else {
            setModalLoading(true)

            postAPI({
                url: 'user/buy',
                data: listOrder,
            })
                .then(res => {
                    if (res.status === 200) {
                        setModalLoading(false)
                        navigation.navigate('WebViewPayment', {
                            url: res.data.vnpUrl,
                            from: 'cart',
                            data: listOrder,
                        })
                    }
                })
                .catch(err => console.log('Payment: ', err))
        }
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <Card
                containerStyle={{
                    ...globalStyles.cardContainer,
                    marginTop: 10,
                }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ChangeInfo')}
                    style={{flexDirection: 'row'}}>
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

                    <Ion
                        name="chevron-forward-outline"
                        size={24}
                        color="black"
                        style={{alignSelf: 'center'}}
                    />
                </TouchableOpacity>
            </Card>

            <Card
                containerStyle={{
                    ...globalStyles.cardContainer,
                    marginTop: 5,
                }}>
                {route.params.map((item, index) => (
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

            <Card
                containerStyle={{...globalStyles.cardContainer, marginTop: 5}}>
                <TouchableOpacity
                    onPress={() => setModalDeliveryVisible(true)}
                    style={{marginHorizontal: 5}}>
                    <Text style={styles.titleStyle}>Delivery Method</Text>

                    <View style={{flexDirection: 'row'}}>
                        <View>
                            <Text style={{color: 'black', fontWeight: '500'}}>
                                {deleveryMethod ? 'COD' : 'Giao Hang Nhanh'}
                            </Text>
                            <Text style={{color: 'black'}}>
                                {deleveryMethod
                                    ? 'Delivery fee will up to you and seller.'
                                    : `${Intl.NumberFormat('en-US').format(
                                          deleveryFee,
                                      )} đ `}
                            </Text>
                        </View>

                        <View style={{flex: 1}} />

                        <Ion
                            name="chevron-forward-outline"
                            size={24}
                            color="black"
                            style={{alignSelf: 'center'}}
                        />
                    </View>
                </TouchableOpacity>
            </Card>

            <Card
                containerStyle={{...globalStyles.cardContainer, marginTop: 5}}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 5,
                        alignItems: 'center',
                    }}>
                    <Ion
                        name="reader-outline"
                        size={24}
                        color={PRIMARY_COLOR}
                    />
                    <Text style={{...styles.titleStyle, marginLeft: 10}}>
                        Order Detail
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 5,
                        marginTop: 5,
                    }}>
                    <Text style={{color: 'black'}}>
                        Total price of products:
                    </Text>

                    <View style={{flex: 1}} />

                    <Text style={{color: 'black'}}>
                        {Intl.NumberFormat('en-US').format(totalCost)} đ
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 5,
                    }}>
                    <Text style={{color: 'black'}}>Total delivery fee:</Text>

                    <View style={{flex: 1}} />

                    <Text style={{color: 'black'}}>
                        {!deleveryMethod
                            ? Intl.NumberFormat('en-US').format(deleveryFee)
                            : 0}{' '}
                        đ
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 5,
                    }}>
                    <Text
                        style={{
                            color: 'black',
                            fontSize: 16,
                            fontWeight: '600',
                        }}>
                        Total payment:
                    </Text>

                    <View style={{flex: 1}} />

                    <Text
                        style={{
                            color: PRIMARY_COLOR,
                            fontSize: 16,
                            fontWeight: '600',
                        }}>
                        {!deleveryMethod
                            ? Intl.NumberFormat('en-US').format(
                                  totalCost + deleveryFee,
                              )
                            : Intl.NumberFormat('en-US').format(totalCost)}{' '}
                        đ
                    </Text>
                </View>
            </Card>

            <View style={styles.paymentContainer}>
                <View style={{flex: 1}} />

                <View
                    style={{
                        alignItems: 'flex-end',
                        marginVertical: 10,
                        marginRight: 10,
                    }}>
                    <Text
                        style={{
                            color: 'black',
                            fontSize: 16,
                            fontWeight: '600',
                        }}>
                        Total payment
                    </Text>

                    <Text
                        style={{
                            color: PRIMARY_COLOR,
                            fontSize: 16,
                            fontWeight: '600',
                        }}>
                        {!deleveryMethod
                            ? Intl.NumberFormat('en-US').format(
                                  totalCost + deleveryFee,
                              )
                            : Intl.NumberFormat('en-US').format(totalCost)}{' '}
                        đ
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handlePaymentClick}
                    style={styles.orderStyle}>
                    <Text style={globalStyles.textButton}>ORDER</Text>
                </TouchableOpacity>
            </View>

            <ModalLoading visible={modalLoading} />

            <Modal
                transparent={true}
                animationType="slide"
                visible={modalDeliveryVisible}>
                <View style={styles.modalView}>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginHorizontal: 5,
                            marginTop: 5,
                        }}>
                        <Text
                            style={{
                                color: 'black',
                                fontWeight: '600',
                                fontSize: 16,
                            }}>
                            Choose delivery method
                        </Text>

                        <View style={{flex: 1}} />

                        <TouchableOpacity
                            onPress={() => setModalDeliveryVisible(false)}>
                            <Ion
                                name="close-circle-outline"
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            setDeleveryMethod(false)
                            setModalDeliveryVisible(false)
                        }}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 10,
                            marginBottom: 10,
                        }}>
                        <View>
                            <Text style={{color: 'black'}}>
                                Giao Hang Nhanh
                            </Text>

                            <View style={{flexDirection: 'row'}}>
                                <Text style={{color: 'black'}}>
                                    Delivery fee:
                                </Text>
                                <Text style={{color: 'black'}}>
                                    {` ${Intl.NumberFormat('en-US').format(
                                        deleveryFee,
                                    )} đ`}
                                </Text>
                            </View>
                        </View>

                        <View style={{flex: 1}} />

                        {!deleveryMethod && (
                            <Ion
                                name="checkmark"
                                color={PRIMARY_COLOR}
                                size={24}
                            />
                        )}
                    </TouchableOpacity>

                    <Divider color={PRIMARY_COLOR} width={3} />

                    <TouchableOpacity
                        onPress={() => {
                            setDeleveryMethod(true)
                            setModalDeliveryVisible(false)
                        }}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            margin: 10,
                        }}>
                        <View>
                            <Text style={{color: 'black'}}>COD</Text>

                            <Text style={{color: 'black'}}>
                                Delivery fee will up to you and seller.
                            </Text>
                        </View>

                        <View style={{flex: 1}} />

                        {deleveryMethod && (
                            <Ion
                                name="checkmark"
                                color={PRIMARY_COLOR}
                                size={24}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default PaymentCartScreen

const styles = StyleSheet.create({
    orderStyle: {
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 10,
    },
    paymentContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '110%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    titleStyle: {
        color: PRIMARY_COLOR,
        fontWeight: '600',
        fontSize: 18,
    },
    modalView: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%',
    },
})