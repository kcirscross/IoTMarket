import React, {useEffect, useLayoutEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {getAPI} from '../../../components/utils/base_API'
import ProductItemHorizontal from '../components/ProductItemHorizontal'

const CartScreen = ({navigation}) => {
    const [listProducts, setListProducts] = useState([])
    const [modalLoading, setModalLoading] = useState(false)

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
    }, [])

    return (
        <SafeAreaView style={{...globalStyles.container, paddingTop: 5}}>
            <ModalLoading visible={modalLoading} />
            {!modalLoading && (
                <ScrollView>
                    {listProducts.map((product, index) => (
                        <ProductItemHorizontal
                            key={index}
                            product={product}
                            navigation={navigation}
                            type="cart"
                        />
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default CartScreen

const styles = StyleSheet.create({})
