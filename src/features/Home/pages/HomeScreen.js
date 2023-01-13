import AsyncStorage from '@react-native-async-storage/async-storage'
import {useIsFocused} from '@react-navigation/native'
import axios from 'axios'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {Badge, SearchBar} from 'react-native-elements'
import Ion from 'react-native-vector-icons/Ionicons'
import {useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    AlertForSignIn,
    API_URL,
    PRIMARY_COLOR,
} from '../../../components/constants'
import {getAPI, postAPI} from '../../../components/utils/base_API'
import {ProductItem} from '../../Products/components'
import {CategoryItem} from '../components'

const HomeScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)

    const listFavorite = useSelector(state => state.favorite)

    const [listProducts, setListProducts] = useState([])
    const [listCategories, setListCategories] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [total, setTotal] = useState(0)
    const isFocus = useIsFocused()
    const [loading, setLoading] = useState(true)
    const [searchValue, setSearchValue] = useState('')
    const [listRecommend, setListRecommend] = useState([])

    let diviceWidth = Dimensions.get('window').width

    //Get Products and Categories, Get Total of Notification
    useEffect(() => {
        getAPI({url: 'product'}).then(
            res => res.status === 200 && setListProducts(res.data.products),
        )

        getAPI({url: 'category'}).then(res => {
            if (res.status === 200) {
                setListCategories(res.data.categories)
                setLoading(false)
            }
        })

        Object.keys(currentUser).length !== 0 &&
            getAPI({url: 'noti'})
                .then(res => {
                    if (res.status === 200) {
                        setTotal(res.data.notifications.length)
                        setLoading(false)
                    }
                })
                .catch(err => console.log('Get Notification: ', err))
    }, [isFocus])

    useEffect(() => {
        listFavorite.length !== 0 &&
            postAPI({
                url: `product/recommend`,
                data: {
                    favorite: listFavorite[0]._id,
                },
            })
                .then(res => {
                    setListRecommend(res.data.product)
                    setLoading(false)
                })
                .catch(err => console.log('Get Recommend List: ', err))
    }, [listFavorite])
    const getRecommend = async () => {
        const token = await AsyncStorage.getItem('token')
        await axios({
            method: 'post',
            url: 'http://10.0.2.2:5000/api/v1/product/recommend',
            headers: {
                authorization: token !== undefined ? `Bearer ${token}` : '',
            },
            data: {
                favorite: listFavorite[0]._id,
            },
        }).then(res => {
            setListRecommend(res.data.product)
        })
    }

    const onRefresh = () => {
        getAPI({url: 'product'}).then(
            res => res.status === 200 && setListProducts(res.data.products),
        )

        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerStyle: {
                backgroundColor: PRIMARY_COLOR,
            },
            headerTitle: () => (
                <View
                    style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        width: diviceWidth,
                    }}>
                    <SearchBar
                        placeholder="Search..."
                        onChangeText={text => setSearchValue(text)}
                        value={searchValue}
                        containerStyle={{
                            backgroundColor: PRIMARY_COLOR,
                            borderColor: PRIMARY_COLOR,
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            flex: 1,
                            padding: 0,
                            margin: 0,
                            marginTop: 5,
                            alignItems: 'center',
                        }}
                        inputContainerStyle={{
                            backgroundColor: 'white',
                            borderColor: PRIMARY_COLOR,
                            height: '90%',
                            alignItems: 'center',
                        }}
                        inputStyle={{
                            color: 'black',
                        }}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 0.3,
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                Object.keys(currentUser).length !== 0
                                    ? navigation.navigate('Cart')
                                    : AlertForSignIn({navigation})
                            }}
                            style={{
                                marginLeft: 5,
                            }}>
                            <Ion name="cart-outline" size={30} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{marginLeft: 10}}
                            onPress={() => {
                                Object.keys(currentUser).length !== 0
                                    ? navigation.navigate('Notification')
                                    : AlertForSignIn({navigation})
                            }}>
                            <Ion
                                name="notifications-outline"
                                size={26}
                                color="white"
                            />
                            <Badge
                                value={
                                    <Text
                                        style={{
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: 12,
                                        }}>
                                        {total < 100 ? total : '99+'}
                                    </Text>
                                }
                                status="error"
                                containerStyle={{
                                    position: 'absolute',
                                    bottom: -5,
                                    right: -5,
                                    padding: 2,
                                    display: total <= 0 ? 'none' : 'flex',
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            ),
        })
    }, [isFocus, loading])

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                {/* Ads view */}
                <View>
                    <Image
                        source={require('~/assets/images/discount.jpg')}
                        style={{
                            width: '100%',
                            height: 190,
                            borderRadius: 10,
                            marginTop: 10,
                        }}
                        resizeMethod="resize"
                        resizeMode="contain"
                    />
                </View>

                {/* List Categories */}
                <Text style={globalStyles.textTitle}>Categories</Text>

                <View
                    style={{
                        alignItems: 'center',
                        marginTop: 5,
                    }}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <FlatList
                            numColumns={
                                listCategories.length > 4
                                    ? Math.ceil(listCategories.length / 2)
                                    : listCategories.length
                            }
                            key={
                                listCategories.length > 4
                                    ? Math.ceil(listCategories.length / 2)
                                    : listCategories.length
                            }
                            scrollEnabled={false}
                            contentContainerStyle={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={listCategories}
                            renderItem={({item, index}) => (
                                <CategoryItem
                                    data={[item, index, listCategories.length]}
                                    key={index}
                                    navigation={navigation}
                                />
                            )}
                        />
                    </ScrollView>
                </View>

                {/* List Recommend Products*/}
                {listRecommend.length !== undefined && (
                    <View
                        style={{
                            marginTop: 5,
                        }}>
                        <Text style={globalStyles.textTitle}>For You</Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                            style={{
                                paddingVertical: 5,
                            }}>
                            {listRecommend.map((data, index) => (
                                <ProductItem
                                    key={index}
                                    data={data}
                                    navigation={navigation}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* List Products */}
                <View
                    style={{
                        marginTop: 5,
                    }}>
                    <Text style={globalStyles.textTitle}>Products</Text>
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
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    adsView: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 10,
        marginTop: 10,
        padding: 10,
    },
})
