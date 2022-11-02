import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import {FollowingItemHorizontal} from '../components'

const FollowingScreen = ({navigation}) => {
    const [listFollowing, setListFollowing] = useState([])
    const [modalLoading, setModalLoading] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Following',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    const getFollowing = async () => {
        try {
            const token = await AsyncStorage.getItem('token')

            axios({
                method: 'get',
                url: `${API_URL}/user/follow`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
                .then(res => {
                    setListFollowing(res.data.follows)
                })
                .catch(err => console.log(err.response))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getFollowing()
    }, [])

    return (
        <SafeAreaView style={globalStyles.container}>
            {!modalLoading ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{paddingTop: 10}}>
                    <ModalLoading visible={modalLoading} />
                    {listFollowing.map((store, index) => (
                        <FollowingItemHorizontal
                            store={store}
                            key={index}
                            navigation={navigation}
                        />
                    ))}
                </ScrollView>
            ) : (
                <View />
            )}
        </SafeAreaView>
    )
}

export default FollowingScreen

const styles = StyleSheet.create({})
