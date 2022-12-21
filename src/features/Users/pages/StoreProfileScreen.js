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
import Ant from 'react-native-vector-icons/AntDesign'
import Ion from 'react-native-vector-icons/Ionicons'
import {useDispatch, useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    AVATAR_BORDER,
    convertTime,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
} from '../../../components/constants'
import {getAPI, patchAPI} from '../../../components/utils/base_API'
import {ProductItem} from '../../Products/components'
import {addFollow, removeFollow} from '../userSlice'

const StoreProfileScreen = ({navigation, route}) => {
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()

    const isStore = !(route.params.store.length == 0)

    const storeInfo = route.params.store
    const ownerInfo = route.params.ownerInfo
    const [isFollow, setIsFollow] = useState(true)
    const [loading, setLoading] = useState(true)
    const [index, setIndex] = useState(0)
    const [filter, setFilter] = useState(true)
    const [modalLoading, setModalLoading] = useState(true)

    const [listProducts, setlistProducts] = useState([])
    const [listProductsNew, setListProductsNew] = useState([])
    const [listProductsSale, setListProductsSale] = useState([])
    const [listProductsPriceDesc, setListProductsPriceDesc] = useState([])
    const [listProductsPriceAsc, setListProductsPriceAsc] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isStore ? storeInfo.displayName : ownerInfo.fullName,
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    const handleFollowClick = () => {
        !isFollow
            ? patchAPI({url: `user/follow/${storeInfo._id}`})
                  .then(res => {
                      if (res.status === 200) {
                          setIsFollow(true)

                          dispatch(addFollow(storeInfo._id))

                          Toast.show({
                              type: 'success',
                              text1: 'Followed',
                          })
                      }
                  })
                  .catch(err => console.log('Follow: ', err))
            : patchAPI({url: `user/unfollow/${storeInfo._id}`})
                  .then(res => {
                      if (res.status === 200) {
                          setIsFollow(false)

                          dispatch(removeFollow(storeInfo._id))

                          Toast.show({
                              type: 'success',
                              text1: 'Unfollowed',
                          })
                      }
                  })
                  .catch(err => console.log('Unfollow: ', err))
    }

    //Get Store Items
    useEffect(() => {
        isStore
            ? getAPI({
                  url: `product/user/${storeInfo._id}`,
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
              })
                  .then(res => {
                      if (res.status === 200) {
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
                          setModalLoading(false)
                      }
                  })
                  .catch(err => console.log('Get Store Items: ', err))
            : getAPI({
                  url: `product/user/${ownerInfo._id}`,
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
              })
                  .then(res => {
                      if (res.status === 200) {
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
                          setModalLoading(false)
                      }
                  })
                  .catch(err => console.log('Get User Items: ', err))
    }, [index, filter])

    return !loading ? (
        isStore ? (
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
                                    borderColor: isFollow
                                        ? 'red'
                                        : PRIMARY_COLOR,
                                    borderWidth: 1,
                                    marginRight: 5,
                                }}>
                                {isFollow ? (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                        <Ant
                                            name="minuscircleo"
                                            size={14}
                                            color="red"
                                        />
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
                                        <Ant
                                            name="pluscircleo"
                                            size={14}
                                            color={PRIMARY_COLOR}
                                        />
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
                                    uri: ownerInfo.avatar,
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
                                {ownerInfo.fullName}
                            </Text>

                            <Text style={{color: 'black', marginLeft: 10}}>
                                {ownerInfo.onlineStatus == 'Online'
                                    ? 'Online'
                                    : convertTime(
                                          Date.parse(ownerInfo.updatedAt),
                                      )}{' '}
                            </Text>
                        </View>

                        <View style={{flex: 1}} />

                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
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
                                paddingBottom: 20,
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
        )
    ) : (
        <View>
            <ModalLoading visible={modalLoading} />
        </View>
    )
}

export default StoreProfileScreen

const styles = StyleSheet.create({
    touchStyle: {
        borderRadius: 10,
        padding: 5,
    },
})
