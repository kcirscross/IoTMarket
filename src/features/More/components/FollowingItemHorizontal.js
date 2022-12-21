import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Avatar, Badge, Card} from 'react-native-elements'
import Ant from 'react-native-vector-icons/AntDesign'
import Ion from 'react-native-vector-icons/Ionicons'
import {useDispatch, useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    AVATAR_BORDER,
    convertTime,
    PRIMARY_COLOR,
} from '../../../components/constants'
import {getAPI, patchAPI} from '../../../components/utils/base_API'
import {addFollow, removeFollow} from '../../Users/userSlice'

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
            : patchAPI({url: `user/unfollow/${store._id}`})
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
        <Card
            containerStyle={{...globalStyles.cardContainer, marginBottom: 12}}>
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

                <View style={{marginLeft: 10, flex: 1}}>
                    <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={{
                            ...styles.labelStyle,
                            fontSize: 20,
                            fontWeight: 'bold',
                            flex: 1,
                        }}>
                        {store.displayName}
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Ion name="star" color="#FA8128" size={16} />
                        <Text style={{color: 'black', marginLeft: 5}}>
                            {store.rating}/5{'     '}|
                        </Text>

                        <Text>{'     '}</Text>
                        <Ion name="person" color={PRIMARY_COLOR} size={16} />
                        <Text style={{color: 'black', marginLeft: 5}}>
                            {store.followers.length} Followers
                        </Text>
                    </View>

                    <Text style={{color: 'black'}}>
                        {ownerInfo.onlineStatus == 'Online'
                            ? 'Online'
                            : convertTime(Date.parse(ownerInfo.updatedAt))}{' '}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handleFollowClick}
                    style={{
                        padding: 5,
                        borderRadius: 10,
                        borderColor: isFollow ? 'red' : PRIMARY_COLOR,
                        borderWidth: 1,
                    }}>
                    {isFollow ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <Ant name="minuscircleo" size={14} color="red" />
                            <Text
                                style={{
                                    color: 'red',
                                    marginLeft: 5,
                                }}>
                                Follow
                            </Text>
                        </View>
                    ) : (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <Ant name="pluscircleo" size={14} color={PRIMARY_COLOR} />
                            <Text
                                style={{
                                    color: PRIMARY_COLOR,
                                    marginLeft: 5,
                                }}>
                                Follow
                            </Text>
                        </View>
                    )}
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
