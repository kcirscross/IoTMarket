import {useIsFocused} from '@react-navigation/native'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {getAPI} from '../../../components/utils/base_API'
import NotiItemHorizontal from '../components/NotiItemHorizontal'

const NotificationScreen = ({navigation}) => {
    const [listNoti, setListNoti] = useState([])
    const [modalLoading, setModalLoading] = useState(true)
    const [index, setIndex] = useState(0)
    const isFocus = useIsFocused()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Notification',
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
        getAPI({url: 'noti'})
            .then(res => {
                if (res.status === 200) {
                    setListNoti(res.data.notifications)
                    setModalLoading(false)
                }
            })
            .catch(err => console.log('Get Notification: ', err))
    }, [isFocus])

    return (
        <SafeAreaView style={globalStyles.container}>
            <ModalLoading visible={modalLoading} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    paddingVertical: 5,
                }}>
                {listNoti.map((noti, index) => (
                    <NotiItemHorizontal
                        key={index}
                        navigation={navigation}
                        noti={noti}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default NotificationScreen

const styles = StyleSheet.create({
    tabItem: {
        margin: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
})
