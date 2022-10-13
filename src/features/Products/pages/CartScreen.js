import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {useLayoutEffect} from 'react'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import ProductItemHorizontal from '../components/ProductItemHorizontal'
import {useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {useState} from 'react'
import {SafeAreaView} from 'react-native'
import {ScrollView} from 'react-native'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {useDispatch, useSelector} from 'react-redux'
import {getCart} from '../cartSlice'

const CartScreen = ({navigation}) => {
    const [listProducts, setListProducts] = useState([])
    const [modalLoading, setModalLoading] = useState(false)

    const currentCart = useSelector(state => state.cart)
    const dispatch = useDispatch()

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
        setListProducts(currentCart)
    }, [])

    return (
        <SafeAreaView style={{...globalStyles.container, paddingTop: 5}}>
            <ScrollView>
                {listProducts.map((product, index) => (
                    <ProductItemHorizontal key={index} product={product} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default CartScreen

const styles = StyleSheet.create({})
