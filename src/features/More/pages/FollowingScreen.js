import React, {useEffect, useLayoutEffect, useState} from 'react'
import {View} from 'react-native'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {getAPI} from '../../../components/utils/base_API'
import {FollowingItemHorizontal} from '../components'

const FollowingScreen = ({navigation}) => {
    const [listFollowing, setListFollowing] = useState([])
    const [modalLoading, setModalLoading] = useState(true)

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

    //Get List Following
    useEffect(() => {
        getAPI({url: 'user/follow'})
            .then(res => {
                if (res.status === 200) {
                    setListFollowing(res.data.follows)
                    setModalLoading(false)
                }
            })
            .catch(err => console.log('Get Follow: ', err))
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
