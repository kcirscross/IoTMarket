import {useIsFocused} from '@react-navigation/native'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native'
import {View} from 'react-native-animatable'
import Toast from 'react-native-toast-message'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {getAPI, patchAPI} from '../../../components/utils/base_API'
import ProductItemHorizontal from '../components/ProductItemHorizontal'

const CartScreen = ({navigation}) => {
    const [listProducts, setListProducts] = useState([])
    const [modalLoading, setModalLoading] = useState(false)
    const [listOrder, setListOrder] = useState([])
    const isFocus = useIsFocused()
    const [newList, setNewList] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'My Cart',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    //Get Cart
    useEffect(() => {
        setListOrder([])
        setModalLoading(true)

        getAPI({url: 'user/cart'})
            .then(res => {
                if (res.status === 200) {
                    setListProducts(res.data.cart.content)
                    setModalLoading(false)
                }
            })
            .catch(err => {
                setModalLoading(false)
                console.log('Get Cart: ', err)
            })
    }, [isFocus])

    const getData = data => {
        data.action
            ? setListOrder([
                  ...listOrder,
                  {product: data.product, quantity: data.quantity},
              ])
            : setListOrder(
                  (newList = listOrder.filter(
                      product => product.product._id != data.product._id,
                  )),
              )
    }

    const handleClearAllClick = () => {
        let i = 0
        while (i <= listProducts.length - 1) {
            setTimeout(async () => {
                await patchAPI({
                    url: 'user/removecart',
                    data: {
                        productId: listProducts[i - 1].productId._id,
                        quantity: listProducts[i - 1].quantity,
                    },
                }).catch(err => console.log('Remove Cart: ', err))
            }, 2000)
            i++
        }

        // tempList.map(product =>
        //     setTimeout(() => {
        //         patchAPI({url: 'user/removecart', data: product}).catch(err =>
        //             console.log('Remove Cart: ', err),
        //         )
        //     }, 2000),
        // )
    }

    return (
        <SafeAreaView style={{...globalStyles.container, paddingTop: 5}}>
            <ModalLoading visible={modalLoading} />

            <TouchableOpacity
                style={styles.touchStyle}
                onPress={handleClearAllClick}>
                <Text style={globalStyles.textButton}>Clear All</Text>
            </TouchableOpacity>

            <Toast position="bottom" bottomOffset={70} />

            {!modalLoading && (
                <View style={{flex: 1}}>
                    <ScrollView>
                        {listProducts.map((product, index) => (
                            <ProductItemHorizontal
                                key={index}
                                product={product}
                                navigation={navigation}
                                type="cart"
                                onPress={getData}
                            />
                        ))}
                    </ScrollView>

                    {listProducts.length > 0 && (
                        <TouchableOpacity
                            onPress={() =>
                                listOrder.length > 0
                                    ? navigation.navigate(
                                          'PaymentCart',
                                          listOrder,
                                      )
                                    : Toast.show({
                                          type: 'error',
                                          text1: 'No item chosen.',
                                      })
                            }
                            style={{
                                ...globalStyles.button,
                                alignSelf: 'center',
                                marginBottom: 10,
                            }}>
                            <Text style={globalStyles.textButton}>Order</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </SafeAreaView>
    )
}

export default CartScreen

const styles = StyleSheet.create({
    touchStyle: {
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-end',
        borderRadius: 10,
        marginBottom: 5,
    },
})
