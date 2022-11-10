import {useIsFocused} from '@react-navigation/native'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import {View} from 'react-native-animatable'
import {Divider, Tab, TabView} from 'react-native-elements'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {getAPI} from '../../../components/utils/base_API'
import OrderItemHorizontal from '../components/OrderItemHorizontal'

const OrderScreen = ({navigation}) => {
    const [listOrders, setListOrders] = useState([])
    const [modalLoading, setModalLoading] = useState(true)
    const [index, setIndex] = useState(0)
    const [reload, setReload] = useState(false)
    const isFocus = useIsFocused()

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
                    setModalLoading(false)
                }
            })
            .catch(err => {
                setModalLoading(false)
                console.log('Get order', err)
            })
    }, [reload, isFocus])

    const setData = data => {
        setIndex(data.index)
        setReload(data.reload)
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <ModalLoading visible={modalLoading} />

            <View>
                <Divider color="black" width={2} />
                <Tab
                    indicatorStyle={{backgroundColor: PRIMARY_COLOR}}
                    value={index}
                    onChange={setIndex}>
                    <Tab.Item
                        title="Shipping"
                        titleStyle={{
                            fontSize: 13,
                            color: index == 0 ? PRIMARY_COLOR : 'black',
                        }}
                        buttonStyle={{
                            padding: 0,
                        }}
                        containerStyle={styles.tabItem}
                    />
                    <Tab.Item
                        title="Delivered"
                        titleStyle={{
                            fontSize: 13,
                            color: index == 1 ? PRIMARY_COLOR : 'black',
                        }}
                        buttonStyle={{
                            padding: 0,
                        }}
                        containerStyle={styles.tabItem}
                    />
                </Tab>
            </View>

            <TabView value={index} onChange={setIndex}>
                <TabView.Item
                    style={{
                        width: '95%',
                    }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                            paddingVertical: 5,
                        }}>
                        {listOrders.map((order, index) =>
                            order.shippingLogs[order.shippingLogs.length - 1] !=
                            undefined ? (
                                order.shippingLogs[
                                    order.shippingLogs.length - 1
                                ].status != 'delivered' && (
                                    <OrderItemHorizontal
                                        key={index}
                                        navigation={navigation}
                                        order={order}
                                        sendIndex={setData}
                                    />
                                )
                            ) : (
                                <OrderItemHorizontal
                                    key={index}
                                    navigation={navigation}
                                    order={order}
                                    sendIndex={setData}
                                />
                            ),
                        )}
                    </ScrollView>
                </TabView.Item>

                <TabView.Item
                    style={{
                        width: '95%',
                    }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                            paddingVertical: 5,
                        }}>
                        {listOrders.map(
                            (order, index) =>
                                order.shippingLogs[
                                    order.shippingLogs.length - 1
                                ] != undefined &&
                                order.shippingLogs[
                                    order.shippingLogs.length - 1
                                ].status === 'delivered' && (
                                    <OrderItemHorizontal
                                        key={index}
                                        navigation={navigation}
                                        order={order}
                                        sendIndex={setData}
                                    />
                                ),
                        )}
                    </ScrollView>
                </TabView.Item>
            </TabView>
        </SafeAreaView>
    )
}

export default OrderScreen

const styles = StyleSheet.create({
    tabItem: {
        margin: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
})
