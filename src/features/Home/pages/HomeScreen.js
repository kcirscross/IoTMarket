import {useIsFocused} from '@react-navigation/native'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {Badge, Input} from 'react-native-elements'
import Ion from 'react-native-vector-icons/Ionicons'
import {useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {getAPI} from '../../../components/utils/base_API'
import {ProductItem} from '../../Products/components'
import {CategoryItem} from '../components'

const HomeScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)

    const [listProducts, setListProducts] = useState([])
    const [listCategories, setListCategories] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [total, setTotal] = useState(0)
    const isFocus = useIsFocused()
    const [loading, setLoading] = useState(true)

    //Get Products and Categories, Get Total of Notification
    useEffect(() => {
        getAPI({url: 'product'}).then(
            res => res.status === 200 && setListProducts(res.data.products),
        )

        getAPI({url: 'category'}).then(
            res => res.status === 200 && setListCategories(res.data.categories),
        )

        getAPI({url: 'noti'})
            .then(res => {
                if (res.status === 200) {
                    setTotal(res.data.notifications.length)
                    setLoading(false)
                }
            })
            .catch(err => console.log('Get Notification: ', err))
    }, [isFocus])

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
                        width: 315,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                    }}>
                    <Input
                        placeholder="Search..."
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                        }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 10,
                            marginTop: 25,
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Cart')}
                        style={{
                            marginLeft: 5,
                        }}>
                        <Ion name="cart-outline" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{marginLeft: 10}}
                        onPress={() => navigation.navigate('Notification')}>
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
                <TouchableOpacity style={styles.adsView}>
                    <Text
                        style={{
                            fontSize: 24,
                            color: 'white',
                        }}>
                        Get discount up to 50%
                    </Text>
                    <Text></Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: 'white',
                        }}>
                        Get a big discount with a very limited time, what are
                        you waiting for shop now!
                    </Text>
                </TouchableOpacity>

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

                {/* List Products */}
                <View
                    style={{
                        marginTop: 5,
                    }}>
                    <Text style={globalStyles.textTitle}>
                        Recommend For You
                    </Text>
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
