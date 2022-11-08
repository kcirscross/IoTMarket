import React, {useEffect, useLayoutEffect, useState} from 'react'
import {Text} from 'react-native'
import {TouchableOpacity} from 'react-native'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import {View} from 'react-native-animatable'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {getAPI} from '../../../components/utils/base_API'
import ProductItemHorizontal from '../components/ProductItemHorizontal'
import Toast from 'react-native-toast-message'
import {useIsFocused} from '@react-navigation/native'

const CartScreen = ({navigation}) => {
    const [listProducts, setListProducts] = useState([])
    const [modalLoading, setModalLoading] = useState(false)
    const [listOrder, setListOrder] = useState([])
    const isFocus = useIsFocused()

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

    return (
        <SafeAreaView style={{...globalStyles.container, paddingTop: 5}}>
            <ModalLoading visible={modalLoading} />

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

                    <TouchableOpacity
                        onPress={() =>
                            listOrder.length > 0
                                ? navigation.navigate('PaymentCart', listOrder)
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
                </View>
            )}
        </SafeAreaView>
    )
}

export default CartScreen

const styles = StyleSheet.create({})
