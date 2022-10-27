import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {Avatar, Badge, Card, Tab, TabView} from 'react-native-elements'
import Toast from 'react-native-toast-message'
import Ion from 'react-native-vector-icons/Ionicons'
import {useDispatch, useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    API_URL,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
} from '../../../components/constants'
import {ProductItem} from '../../Products/components'
import {addFollow, removeFollow} from '../userSlice'

const ProfileScreen = ({navigation, route}) => {
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()

    const [myProductsList, setMyProductsList] = useState([])
    const [myProductListNew, setMyProductListNew] = useState([])
    const [myProductListSale, setMyProductListSale] = useState([])
    const [myProductLisPriceDesc, setMyProductLisPriceDesc] = useState([])
    const [myProductLisPriceAsc, setMyProductLisPriceAsc] = useState([])
    const [modalLoading, setModalLoading] = useState(false)
    const [index, setIndex] = useState(0)
    const [filter, setFilter] = useState(true)
    const isCurrentUser =
        route.params[0] == currentUser._id ||
        route.params[0] == currentUser.storeId ||
        route.params._id == currentUser._id ||
        route.params.storeId == currentUser.storeId

    const isCurrentStore =
        route.params[0] == currentUser.storeId ||
        route.params.storeId == currentUser.storeId

    const [userInfo, setUserInfo] = useState([])
    const [isFollow, setIsFollow] = useState(false)

    const [userProductsList, setUserProductsList] = useState([])
    const [userProductListNew, setUserProductListNew] = useState([])
    const [userProductListSale, setUserProductListSale] = useState([])
    const [userProductLisPriceDesc, setUserProductLisPriceDesc] = useState([])
    const [userProductLisPriceAsc, setUserProductLisPriceAsc] = useState([])

    const [isStore, setIsStore] = useState(false)
    const [storeInfo, setStoreInfo] = useState([])

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

    const getMyItems = async () => {
        setModalLoading(true)
        try {
            const token = await AsyncStorage.getItem('token')
            axios({
                method: 'get',
                url: `${API_URL}/product/me`,
                params: {
                    sortBy: `${
                        index == 0
                            ? 'pop'
                            : index == 1
                            ? 'new'
                            : index == 2
                            ? 'sale'
                            : index == 3
                            ? filter
                                ? 'pricedesc'
                                : 'priceacs'
                            : ''
                    }`,
                },
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }).then(res => {
                if (res.status == 200) {
                    index == 0
                        ? setMyProductsList(res.data.products)
                        : index == 1
                        ? setMyProductListNew(res.data.products)
                        : index == 2
                        ? setMyProductListSale(res.data.products)
                        : index == 3
                        ? filter
                            ? setMyProductLisPriceDesc(res.data.products)
                            : setMyProductLisPriceAsc(res.data.products)
                        : setMyProductLisPriceAsc(res.data.products)
                    setModalLoading(false)
                }
            })
        } catch (error) {
            console.log(error)
            setModalLoading(false)
        }
    }

    const getUserInfo = () => {
        setModalLoading(true)

        axios({
            method: 'get',
            url: `${API_URL}/user/${route.params._id}`,
        })
            .then(res => {
                if (res.status == 200) {
                    setUserInfo(res.data.userInfo)

                    currentUser.follows == res.data.userInfo.storeId &&
                        setIsFollow(true)

                    setModalLoading(false)
                }
            })
            .catch(err => {
                setModalLoading(false)
                console.log('UserProfile: ', err.response.data)
            })

        if (route.params.storeId != undefined) {
            setModalLoading(true)
            setIsStore(true)

            axios({
                method: 'get',
                url: `${API_URL}/store/${route.params.storeId}`,
            })
                .then(res => {
                    setModalLoading(false)
                    setStoreInfo(res.data.store)
                })
                .catch(error => {
                    setModalLoading(false)
                    console.log(error.response.data)
                })
        }
    }

    const getMyStore = () => {
        setModalLoading(true)

        axios({
            method: 'get',
            url: `${API_URL}/store/${route.params[0]}`,
        })
            .then(res => {
                setModalLoading(false)
                setStoreInfo(res.data.store)
            })
            .catch(error => {
                setModalLoading(false)
                console.log(error.response.data)
            })
    }

    const getUserItems = () => {
        setModalLoading(true)
        axios({
            method: 'get',
            url: `${API_URL}/product/user/${route.params._id}`,
            params: {
                sortBy: `${
                    index == 0
                        ? 'pop'
                        : index == 1
                        ? 'new'
                        : index == 2
                        ? 'sale'
                        : index == 3
                        ? filter
                            ? 'pricedesc'
                            : 'priceacs'
                        : ''
                }`,
            },
        }).then(res => {
            if (res.status == 200) {
                index == 0
                    ? setUserProductsList(res.data.products)
                    : index == 1
                    ? setUserProductListNew(res.data.products)
                    : index == 2
                    ? setUserProductListSale(res.data.products)
                    : index == 3
                    ? filter
                        ? setUserProductLisPriceDesc(res.data.products)
                        : setUserProductLisPriceAsc(res.data.products)
                    : setUserProductLisPriceAsc(res.data.products)
                setModalLoading(false)
            }
        })
    }

    const handleFollowClick = async () => {
        try {
            setModalLoading(true)
            const token = await AsyncStorage.getItem('token')
            if (!isFollow) {
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/follow/${userInfo.storeId}`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => {
                        if (res.status == 200) {
                            dispatch(addFollow(userInfo.storeId))

                            Toast.show({
                                type: 'success',
                                text1: 'Followed',
                            })

                            setIsFollow(true)
                            setModalLoading(false)
                        }
                    })
                    .catch(error => console.log(error))
            } else {
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/unfollow/${userInfo.storeId}`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => {
                        if (res.status == 200) {
                            dispatch(removeFollow(userInfo.storeId))

                            Toast.show({
                                type: 'success',
                                text1: 'Unfollowed',
                            })
                            setModalLoading(false)
                            setIsFollow(false)
                        }
                    })
                    .catch(error => console.log(error))
            }
        } catch (error) {
            console.log(error)
            setModalLoading(false)
        }
    }

    useEffect(() => {
        isCurrentUser ? getMyItems() : getUserItems()
    }, [index, filter])

    useEffect(() => {
        !isCurrentUser ? getUserInfo() : isCurrentStore && getMyStore()
    }, [])

    return (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                opacity: modalLoading ? 0.3 : 1,
            }}>
            <Toast position="bottom" bottomOffset={70} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <ModalLoading visible={modalLoading} />
                <Card
                    containerStyle={{
                        ...globalStyles.cardContainer,
                        marginTop: 10,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <View>
                            <Avatar
                                rounded
                                size={'large'}
                                source={{
                                    uri: isCurrentUser
                                        ? isCurrentStore
                                            ? storeInfo.shopImage
                                            : currentUser.avatar
                                        : isStore
                                        ? storeInfo.shopImage
                                        : userInfo.avatar,
                                }}
                                avatarStyle={{
                                    borderWidth: 1,
                                    borderColor: 'black',
                                }}
                            />

                            <Badge
                                value=" "
                                status={
                                    isCurrentUser
                                        ? currentUser.onlineStatus == 'Online'
                                            ? 'success'
                                            : 'warning'
                                        : userInfo.onlineStatus == 'Online'
                                        ? 'success'
                                        : 'warning'
                                }
                                containerStyle={{
                                    position: 'absolute',
                                    bottom: 2,
                                    right: 5,
                                }}
                            />
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: 'black',
                                    marginLeft: 10,
                                    fontSize: 18,
                                }}>
                                {isCurrentUser
                                    ? isCurrentStore
                                        ? storeInfo.displayName
                                        : currentUser.fullName
                                    : isStore
                                    ? storeInfo.displayName
                                    : userInfo.fullName}
                            </Text>

                            <Text style={{color: 'black', marginLeft: 10}}>
                                {isCurrentUser
                                    ? currentUser.onlineStatus == 'Online'
                                        ? 'Online'
                                        : convertTime(
                                              Date.parse(currentUser.updatedAt),
                                          )
                                    : currentUser.onlineStatus == 'Online'
                                    ? 'Online'
                                    : convertTime(
                                          Date.parse(userInfo.updatedAt),
                                      )}
                            </Text>
                        </View>

                        <View style={{flex: 1}} />
                        {isCurrentUser + isCurrentStore < 2 ? (
                            <View
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                {userInfo.storeId != undefined && (
                                    <TouchableOpacity
                                        onPress={handleFollowClick}
                                        style={{
                                            ...styles.touchStyle,
                                            backgroundColor: isFollow
                                                ? 'red'
                                                : PRIMARY_COLOR,
                                            marginRight: 5,
                                        }}>
                                        <Text style={{color: 'white'}}>
                                            {isFollow ? '- Follow' : '+ Follow'}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={{
                                        ...styles.touchStyle,
                                        backgroundColor: PRIMARY_COLOR,
                                        marginRight: 5,
                                        flexDirection: 'row',
                                        marginTop: 5,
                                    }}>
                                    <Ion
                                        name="chatbubble-ellipses-outline"
                                        size={18}
                                        color="white"
                                    />
                                    <Text style={{color: 'white'}}> Chat</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View></View>
                        )}
                    </View>

                    {isStore && (
                        <View>
                            <Text
                                style={{
                                    color: 'black',
                                    marginLeft: 85,
                                }}>
                                Description: {storeInfo.description}
                            </Text>
                        </View>
                    )}
                </Card>
                <View
                    style={{
                        borderTopColor: 'black',
                        borderTopWidth: 1,
                        borderBottomColor: SECONDARY_COLOR,
                        borderBottomWidth: 1,
                        marginTop: 5,
                    }}>
                    <Tab
                        indicatorStyle={{backgroundColor: PRIMARY_COLOR}}
                        value={index}
                        onChange={setIndex}>
                        <Tab.Item
                            title="popular"
                            titleStyle={{
                                fontSize: 13,
                                color: index == 0 ? PRIMARY_COLOR : 'black',
                            }}
                            buttonStyle={{
                                padding: 0,
                            }}
                            containerStyle={{
                                padding: 0,
                                margin: 0,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        />
                        <Tab.Item
                            title="newest"
                            titleStyle={{
                                fontSize: 13,
                                color: index == 1 ? PRIMARY_COLOR : 'black',
                            }}
                            buttonStyle={{
                                padding: 0,
                            }}
                            containerStyle={{
                                padding: 0,
                                margin: 0,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        />
                        <Tab.Item
                            title="best sale"
                            titleStyle={{
                                fontSize: 13,
                                color: index == 2 ? PRIMARY_COLOR : 'black',
                            }}
                            buttonStyle={{
                                padding: 0,
                            }}
                            containerStyle={{
                                padding: 0,
                                margin: 0,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        />
                        <Tab.Item
                            title="price"
                            titleStyle={{
                                fontSize: 13,
                                color: index == 3 ? PRIMARY_COLOR : 'black',
                            }}
                            buttonStyle={{
                                padding: 0,
                            }}
                            containerStyle={{
                                padding: 0,
                                margin: 0,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPressIn={() => {
                                setFilter(!filter)
                            }}
                            iconRight={true}
                            icon={
                                filter ? (
                                    <Ion
                                        name="arrow-down-outline"
                                        size={16}
                                        color={
                                            index == 3 ? PRIMARY_COLOR : 'black'
                                        }
                                    />
                                ) : (
                                    <Ion
                                        name="arrow-up-outline"
                                        size={16}
                                        color={
                                            index == 3 ? PRIMARY_COLOR : 'black'
                                        }
                                    />
                                )
                            }
                        />
                    </Tab>
                </View>

                <TabView value={index} onChange={setIndex}>
                    <TabView.Item style={{width: '100%'}}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                            style={{
                                paddingVertical: 5,
                            }}>
                            {isCurrentUser
                                ? myProductsList.map((data, index) => (
                                      <ProductItem
                                          key={index}
                                          data={data}
                                          navigation={navigation}
                                      />
                                  ))
                                : userProductsList.map((data, index) => (
                                      <ProductItem
                                          key={index}
                                          data={data}
                                          navigation={navigation}
                                      />
                                  ))}
                        </ScrollView>
                    </TabView.Item>
                    <TabView.Item style={{width: '100%'}}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                            style={{
                                paddingVertical: 5,
                            }}>
                            {isCurrentUser
                                ? myProductListNew.map((data, index) => (
                                      <ProductItem
                                          key={index}
                                          data={data}
                                          navigation={navigation}
                                      />
                                  ))
                                : userProductListNew.map((data, index) => (
                                      <ProductItem
                                          key={index}
                                          data={data}
                                          navigation={navigation}
                                      />
                                  ))}
                        </ScrollView>
                    </TabView.Item>
                    <TabView.Item style={{width: '100%'}}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                            style={{
                                paddingVertical: 5,
                            }}>
                            {isCurrentUser
                                ? myProductListSale.map((data, index) => (
                                      <ProductItem
                                          key={index}
                                          data={data}
                                          navigation={navigation}
                                      />
                                  ))
                                : userProductListSale.map((data, index) => (
                                      <ProductItem
                                          key={index}
                                          data={data}
                                          navigation={navigation}
                                      />
                                  ))}
                        </ScrollView>
                    </TabView.Item>
                    <TabView.Item style={{width: '100%'}}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                            style={{
                                paddingVertical: 5,
                            }}>
                            {isCurrentUser && filter
                                ? myProductLisPriceDesc.map((data, index) => (
                                      <ProductItem
                                          key={index}
                                          data={data}
                                          navigation={navigation}
                                      />
                                  ))
                                : myProductLisPriceAsc.map((data, index) => (
                                      <ProductItem
                                          key={index}
                                          data={data}
                                          navigation={navigation}
                                      />
                                  ))}

                            {!isCurrentUser && filter
                                ? userProductLisPriceDesc.map((data, index) => (
                                      <ProductItem
                                          key={index}
                                          data={data}
                                          navigation={navigation}
                                      />
                                  ))
                                : userProductLisPriceAsc.map((data, index) => (
                                      <ProductItem
                                          key={index}
                                          data={data}
                                          navigation={navigation}
                                      />
                                  ))}
                        </ScrollView>
                    </TabView.Item>
                </TabView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    touchStyle: {
        borderRadius: 10,
        padding: 5,
    },
    touchFilter: {
        borderWidth: 1,
        borderColor: 'black',
        width: '25%',
        alignItems: 'center',
    },
})
