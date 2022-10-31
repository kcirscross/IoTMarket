import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import ProductItemHorizontal from '../components/ProductItemHorizontal'

const CartScreen = ({navigation}) => {
    const [listProducts, setListProducts] = useState([])
    const [modalLoading, setModalLoading] = useState(false)

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

    const getCart = async () => {
        try {
            setModalLoading(true)
            const token = await AsyncStorage.getItem('token')

            axios({
                method: 'get',
                url: `${API_URL}/user/cart`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
                .then(res => {
                    if (res.status === 200) {
                        setListProducts(res.data.cart.content)
                        setModalLoading(false)
                    }
                })
                .catch(error => {
                    setModalLoading(false)
                    console.log('Get Cart: ', error.response)
                })
        } catch (error) {
            setModalLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        getCart()
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
