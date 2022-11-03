import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar, Badge, Card } from 'react-native-elements'
import { useDispatch, useSelector } from 'react-redux'
import { globalStyles } from '../../../assets/styles/globalStyles'
import {
    AVATAR_BORDER,
    convertTime,
    PRIMARY_COLOR
} from '../../../components/constants'
import { getAPI, patchAPI } from '../../../components/utils/base_API'
import { addFollow, removeFollow } from '../../Users/userSlice'

const FollowingItemHorizontal = ({navigation, store}) => {
    const [isFollow, setIsFollow] = useState(true)
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [ownerInfo, setOwnerInfo] = useState([])
    const [loading, setLoading] = useState(true)

    const handleFollowClick = async () => {
        !isFollow
            ? patchAPI({url: `user/follow/${store._id}`})
                  .then(res => {
                      if (res.status === 200) {
                          dispatch(addFollow(store._id))

                          setIsFollow(true)
                      }
                  })
                  .catch(err => console.log('Follow: ', err))
            : patchAPI({url: `user/follow/${store._id}`})
                  .then(res => {
                      if (res.status === 200) {
                          dispatch(removeFollow(store._id))

                          setIsFollow(false)
                      }
                  })
                  .catch(err => console.log('Follow: ', err))
    }

    //Get User Information
    useEffect(() => {
        getAPI({url: `user/${store.ownerId}`})
            .then(res => {
                if (res.status === 200) {
                    setOwnerInfo(res.data.userInfo)
                    setLoading(false)
                }
            })
            .catch(err => console.log('Get User: ', err))
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
