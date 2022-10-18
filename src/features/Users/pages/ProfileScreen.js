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
import Ion from 'react-native-vector-icons/Ionicons'
import {useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    API_URL,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
} from '../../../components/constants'
import {ProductItem} from '../../Products/components'

const ProfileScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)
    const [myProductsList, setMyProductsList] = useState([])
    const [modalLoading, setModalLoading] = useState(false)
    const [index, setIndex] = useState(0)

    console.log(currentUser)

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
                url: `${API_URL}/product/me/${
                    index == 0
                        ? ''
                        : index == 1
                        ? 'new'
                        : index == 2
                        ? 'sale'
                        : index == 3
                        ? 'pricedesc'
                        : 'priceacs'
                }`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }).then(res => {
                if (res.status == 200) {
                    setMyProductsList(res.data.products)
                    setModalLoading(false)
                }
            })
        } catch (error) {
            console.log(error)
            setModalLoading(false)
        }
    }

    useEffect(() => {
        getMyItems()
    }, [index])

    return (
        <SafeAreaView style={globalStyles.container}>
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
                                source={{uri: currentUser.avatar}}
                                avatarStyle={{
                                    borderWidth: 1,
                                    borderColor: SECONDARY_COLOR,
                                }}
                            />
                            <Badge
                                value=" "
                                status={
                                    currentUser.onlineStatus == 'Online'
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
                                {currentUser.fullName}
                            </Text>
                            <Text style={{color: 'black', marginLeft: 10}}>
                                {currentUser.onlineStatus == 'Online'
                                    ? 'Online'
                                    : convertTime(
                                          Date.parse(currentUser.updatedAt),
                                      )}{' '}
                                | {currentUser.follows.length} Followers
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
                                }}>
                                <Text style={{color: 'white'}}>+ Follow</Text>
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
                            {modalLoading == false &&
                                myProductsList.map((data, index) => (
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
                            {modalLoading == false &&
                                myProductsList.map((data, index) => (
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
                            {modalLoading == false &&
                                myProductsList.map((data, index) => (
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
                            {modalLoading == false &&
                                myProductsList.map((data, index) => (
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
