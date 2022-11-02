import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Avatar, Badge, Card} from 'react-native-elements'
import {useDispatch, useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    API_URL,
    AVATAR_BORDER,
    PRIMARY_COLOR,
} from '../../../components/constants'
import {addFollow, removeFollow} from '../../Users/userSlice'

const FollowingItemHorizontal = ({navigation, store}) => {
    const [isFollow, setIsFollow] = useState(true)
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [ownerInfo, setOwnerInfo] = useState([])
    const [loading, setLoading] = useState(true)

    const handleFollowClick = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            if (!isFollow) {
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/follow/${store._id}`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => {
                        if (res.status == 200) {
                            dispatch(addFollow(store._id))

                            setIsFollow(true)
                        }
                    })
                    .catch(error => console.log(error))
            } else {
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/unfollow/${store._id}`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => {
                        if (res.status == 200) {
                            dispatch(removeFollow(store._id))

                            setIsFollow(false)
                        }
                    })
                    .catch(error => console.log(error))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const convertTime = ms => {
        let temp = (Date.now() - ms) / 1000
        if (temp < 120) {
            return 'Just now'
        } else if (temp >= 120 && temp / 60 / 60 < 1) {
            return (temp / 60).toFixed(0) + ' minutes ago'
        } else if (temp / 60 / 60 >= 1 && temp / 60 / 60 < 2) {
            return '1 hour ago'
        } else if (temp / 60 / 60 >= 2 && temp / 60 / 60 / 24 < 1) {
            return (temp / 60 / 60).toFixed(0) + ' hours ago'
        } else if (temp / 60 / 60 / 24 >= 1 && temp / 60 / 60 / 24 < 2) {
            return '1 day ago'
        } else {
            return (temp / 60 / 60 / 24).toFixed(0) + ' days ago'
        }
    }

    const getOwnerInfo = () => {
        axios({
            method: 'get',
            url: `${API_URL}/user/${store.ownerId}`,
        })
            .then(res => {
                setOwnerInfo(res.data.userInfo)
                setLoading(false)
            })
            .catch(err => console.log('Get User: ', err.response))
    }

    useEffect(() => {
        getOwnerInfo()
    }, [])

    return !loading ? (
        <Card containerStyle={{...globalStyles.cardContainer, marginBottom: 5}}>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('StoreProfile', {store, ownerInfo})
                }
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <View>
                    <Avatar
                        rounded
                        size={65}
                        source={
                            store.shopImage == ''
                                ? require('~/assets/images/logo.jpg')
                                : {uri: store.shopImage}
                        }
                        avatarStyle={{
                            borderColor: AVATAR_BORDER,
                            borderWidth: 1,
                        }}
                    />

                    <Badge
                        value=" "
                        status={
                            ownerInfo.onlineStatus == 'Online'
                                ? 'success'
                                : 'warning'
                        }
                        containerStyle={{
                            position: 'absolute',
                            bottom: 2,
                            right: 3,
                        }}
                    />
                </View>

                <View style={{marginLeft: 10}}>
                    <Text
                        style={{
                            ...styles.labelStyle,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}>
                        {store.displayName}
                    </Text>

                    <Text style={{color: 'black'}}>
                        {ownerInfo.onlineStatus == 'Online'
                            ? 'Online'
                            : convertTime(Date.parse(ownerInfo.updatedAt))}{' '}
                    </Text>
                </View>

                <View style={{flex: 1}} />

                <TouchableOpacity
                    onPress={handleFollowClick}
                    style={{
                        padding: 5,
                        borderRadius: 10,
                        backgroundColor: isFollow ? 'red' : PRIMARY_COLOR,
                    }}>
                    <Text style={{color: 'white'}}>
                        {isFollow ? '- Follow' : '+ Follow'}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </Card>
    ) : (
        <View />
    )
}

export default FollowingItemHorizontal

const styles = StyleSheet.create({
    labelStyle: {
        color: 'black',
        fontWeight: 'normal',
    },
})
