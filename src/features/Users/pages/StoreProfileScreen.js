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
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    API_URL,
    AVATAR_BORDER,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
} from '../../../components/constants'
import {ProductItem} from '../../Products/components'
import {addFollow, removeFollow} from '../userSlice'

const StoreProfileScreen = ({navigation, route}) => {
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()

    const storeInfo = route.params.store
    const ownerInfo = route.params.ownerInfo
    const [isFollow, setIsFollow] = useState(true)

    const [loading, setLoading] = useState(true)

    const [index, setIndex] = useState(0)
    const [filter, setFilter] = useState(true)

    const [listProducts, setlistProducts] = useState([])
    const [listProductsNew, setListProductsNew] = useState([])
    const [listProductsSale, setListProductsSale] = useState([])
    const [listProductsPriceDesc, setListProductsPriceDesc] = useState([])
    const [listProductsPriceAsc, setListProductsPriceAsc] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: storeInfo.displayName,
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

    const getStoreItems = () => {
        axios({
            method: 'get',
            url: `${API_URL}/product/user/${storeInfo._id}`,
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
                    ? setlistProducts(res.data.products)
                    : index == 1
                    ? setListProductsNew(res.data.products)
                    : index == 2
                    ? setListProductsSale(res.data.products)
                    : index == 3
                    ? filter
                        ? setListProductsPriceDesc(res.data.products)
                        : setListProductsPriceAsc(res.data.products)
                    : setListProductsPriceAsc(res.data.products)

                setLoading(false)
            }
        })
    }

    const handleFollowClick = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            if (!isFollow) {
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/follow/${storeInfo._id}`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => {
                        if (res.status == 200) {
                            dispatch(addFollow(storeInfo._id))

                            Toast.show({
                                type: 'success',
                                text1: 'Followed',
                            })

                            setIsFollow(true)
                        }
                    })
                    .catch(error => console.log(error))
            } else {
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/unfollow/${storeInfo._id}`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => {
                        if (res.status == 200) {
                            dispatch(removeFollow(storeInfo._id))

                            Toast.show({
                                type: 'success',
                                text1: 'Unfollowed',
                            })
                            setIsFollow(false)
                        }
                    })
                    .catch(error => console.log(error))
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getStoreItems()
    }, [index, filter])

    return !loading ? (
        <SafeAreaView style={globalStyles.container}>
            <Toast position="bottom" bottomOffset={70} />
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
                                uri: storeInfo.shopImage,
                            }}
                            avatarStyle={{
                                borderWidth: 1,
                                borderColor: AVATAR_BORDER,
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
                            {storeInfo.displayName}
                        </Text>

                        <Text style={{color: 'black', marginLeft: 10}}>
                            {ownerInfo.onlineStatus == 'Online'
                                ? 'Online'
                                : convertTime(
                                      Date.parse(ownerInfo.updatedAt),
                                  )}{' '}
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 10,
                            }}>
                            <Ion name="star" color="#FA8128" size={16} />
                            <Text style={{color: 'black', marginLeft: 5}}>
                                {storeInfo.rating}/5{'     '}|
                            </Text>

                            <Text>{'     '}</Text>
                            <Ion
                                name="person"
                                color={PRIMARY_COLOR}
                                size={16}
                            />
                            <Text style={{color: 'black', marginLeft: 5}}>
                                {storeInfo.followers.length} Followers
                            </Text>
                        </View>
                    </View>

                    <View style={{flex: 1}} />

                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
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
                </View>

                <Text
                    style={{
                        color: 'black',
                        marginLeft: 85,
                    }}>
                    Description: {storeInfo.description}
                </Text>
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
                                    color={index == 3 ? PRIMARY_COLOR : 'black'}
                                />
                            ) : (
                                <Ion
                                    name="arrow-up-outline"
                                    size={16}
                                    color={index == 3 ? PRIMARY_COLOR : 'black'}
                                />
                            )
                        }
                    />
                </Tab>
            </View>

            <TabView value={index} onChange={setIndex}>
                <TabView.Item>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}
                        style={{
                            paddingVertical: 5,
                        }}>
                        {listProducts.map((data, index) => (
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
                        {listProductsNew.map((data, index) => (
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
                        {listProductsSale.map((data, index) => (
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
                        {filter
                            ? listProductsPriceDesc.map((data, index) => (
                                  <ProductItem
                                      key={index}
                                      data={data}
                                      navigation={navigation}
                                  />
                              ))
                            : listProductsPriceAsc.map((data, index) => (
                                  <ProductItem
                                      key={index}
                                      data={data}
                                      navigation={navigation}
                                  />
                              ))}
                    </ScrollView>
                </TabView.Item>
            </TabView>
        </SafeAreaView>
    ) : (
        <View />
    )
}

export default StoreProfileScreen

const styles = StyleSheet.create({
    touchStyle: {
        borderRadius: 10,
        padding: 5,
    },
})
