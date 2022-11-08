import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import ModalLoading from '~/components/utils/ModalLoading'
import { globalStyles } from '../../../assets/styles/globalStyles'
import { PRIMARY_COLOR } from '../../../components/constants'
import { getAPI } from '../../../components/utils/base_API'
import OrderItemHorizontal from '../components/OrderItemHorizontal'

const OrderScreen = ({navigation}) => {
    const [listOrders, setListOrders] = useState([])
    const [modalLoading, setModalLoading] = useState(true)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'My Order',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    useEffect(() => {
        setModalLoading(true)
        getAPI({url: 'order/buyer'})
            .then(res => {
                if (res.status === 200) {
                    setListOrders(res.data.orders)
                    console.log(res.data.orders)
                    setModalLoading(false)
                }
            })
            .catch(err => {
                setModalLoading(false)
                console.log('Get order', err)
            })
    }, [])

    return (
        <SafeAreaView style={globalStyles.container}>
            <ModalLoading visible={modalLoading} />
            <ScrollView
                style={{marginTop: 5}}
                showsVerticalScrollIndicator={false}>
                {listOrders.map((order, index) => (
                    <OrderItemHorizontal
                        key={index}
                        navigation={navigation}
                        order={order}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default OrderScreen

const styles = StyleSheet.create({})
