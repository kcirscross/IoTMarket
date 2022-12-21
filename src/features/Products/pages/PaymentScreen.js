import {useIsFocused} from '@react-navigation/native'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    Alert,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {Card, Divider} from 'react-native-elements'
import Toast from 'react-native-toast-message'
import Ion from 'react-native-vector-icons/Ionicons'
import Material from 'react-native-vector-icons/MaterialIcons'
import {useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {postAPI} from '../../../components/utils/base_API'

const PaymentScreen = ({navigation, route}) => {
    const currentUser = useSelector(state => state.user)

    const {product, quantity} = route.params
    const ownerInfo = route.params.productOwner

    const [modalDeliveryVisible, setModalDeliveryVisible] = useState(false)
    const [deleveryFee, setDeleveryFee] = useState(0)
    const [deleveryMethod, setDeleveryMethod] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const isFocus = useIsFocused()

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
        setModalLoading(true)
        postAPI({
            url: 'shipping/calculate',
            data: [{productId: product._id, quantity: quantity}],
        })
            .then(res => {
                if (res.status === 200) {
                    setDeleveryFee(res.data.totalShippingFee)
                    setModalLoading(false)
                }
            })
            .catch(err => console.log('Get Delivery Fee: ', err))
    }, [isFocus])

    const handlePaymentClick = () => {
        if (Object.keys(currentUser.address).length !== 0) {
            if (deleveryMethod) {
                Alert.alert(
                    'Confirm Order',
                    'You will pay when receive product.',
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
                                    data: [
                                        {
                                            productId: product._id,
                                            quantity: quantity,
                                        },
                                    ],
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
                    data: [{productId: product._id, quantity: quantity}],
                })
                    .then(res => {
                        if (res.status === 200) {
                            navigation.navigate('WebViewPayment', {
                                url: res.data.vnpUrl,
                            })
                            setModalLoading(false)
                        }
                    })
                    .catch(err => console.log('Payment: ', err))
            }
        } else {
            Toast.show({text1: 'Please fill in your address.', type: 'error'})
        }
    }

    return !modalLoading ? (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                opacity: modalDeliveryVisible + modalLoading ? 0.3 : 1,
            }}>
            <Card
                containerStyle={{
                    ...globalStyles.cardContainer,
                    marginTop: 10,
                }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ChangeInfo')}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ion
                            name="location-outline"
                            color={PRIMARY_COLOR}
                            size={30}
                        />
                        <Text style={styles.titleStyle}>Address</Text>
                    </View>

                    <View style={{flexDirection: 'row', marginLeft: 10}}>
                        <Text
                            style={{
                                color: 'black',
                            }}>{`${currentUser.fullName}  |  ${currentUser.phoneNumber}\n${currentUser.address.street},\n${currentUser.address.ward}, ${currentUser.address.district},\n${currentUser.address.city}.`}</Text>
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
                containerStyle={{
                    ...globalStyles.cardContainer,
                    marginTop: 12,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ion name="cart-outline" size={30} color={PRIMARY_COLOR} />
                    <Text style={styles.titleStyle}>Product List</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                        source={{uri: product.thumbnailImage}}
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
                            marginHorizontal: 10,
                            flex: 1,
                        }}>
                        <Text style={{color: 'black'}}>
                            {product.productName}
                        </Text>
                        <View style={{flex: 1}} />
                        <View style={{flexDirection: 'row'}}>
                            <Text>
                                {Intl.NumberFormat('en-US').format(
                                    product.price,
                                )}{' '}
                                đ
                            </Text>
                            <View style={{flex: 1}} />
                            <Text>x{quantity}</Text>
                        </View>
                    </View>
                </View>
            </Card>

            <Card
                containerStyle={{
                    ...globalStyles.cardContainer,
                    marginTop: 12,
                }}>
                <TouchableOpacity
                    onPress={() => setModalDeliveryVisible(true)}
                    style={{marginHorizontal: 5}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Material
                            name="local-shipping"
                            size={26}
                            color={PRIMARY_COLOR}
                        />
                        <Text style={styles.titleStyle}>Delivery Method</Text>
                    </View>

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
                containerStyle={{
                    ...globalStyles.cardContainer,
                    marginTop: 12,
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <Ion
                        name="reader-outline"
                        size={30}
                        color={PRIMARY_COLOR}
                    />
                    <Text style={styles.titleStyle}>Order Detail</Text>
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
                        {Intl.NumberFormat('en-US').format(
                            product.price * quantity,
                        )}{' '}
                        đ
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
                                  product.price * quantity + deleveryFee,
                              )
                            : Intl.NumberFormat('en-US').format(
                                  product.price * quantity,
                              )}{' '}
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
                                  product.price * quantity + deleveryFee,
                              )
                            : Intl.NumberFormat('en-US').format(
                                  product.price * quantity,
                              )}{' '}
                        đ
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handlePaymentClick}
                    style={styles.orderStyle}>
                    <Text style={globalStyles.textButton}>CHECKOUT</Text>
                </TouchableOpacity>
            </View>

            <ModalLoading visible={modalLoading} />

            <Toast bottomOffset={70} position="bottom" />

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
    ) : (
        <View>
            <ModalLoading visible={modalLoading} />
        </View>
    )
}

export default PaymentScreen

const styles = StyleSheet.create({
    modalView: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%',
    },
    titleStyle: {
        color: PRIMARY_COLOR,
        fontWeight: '600',
        fontSize: 18,
        marginLeft: 10,
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
    orderStyle: {
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 10,
    },
})
