import axios from 'axios'
import React, {useLayoutEffect} from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
import {RefreshControl} from 'react-native'
import {FlatList} from 'react-native'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {Input} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Ion from 'react-native-vector-icons/Ionicons'
import {useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import {ProductItem} from '../../Products/components'
import {CategoryItem} from '../components'

const HomeScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)

    const [listProducts, setListProducts] = useState([])
    const [listCategories, setListCategories] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    const getProducts = () => {
        axios({
            method: 'get',
            url: `${API_URL}/product`,
        })
            .then(res => {
                setListProducts(res.data.products)
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        getProducts()
    }, [])

    useEffect(() => {
        axios({
            method: 'get',
            url: `${API_URL}/category`,
        })
            .then(res => {
                if (res.status == 200) {
                    setListCategories(res.data.categories)
                }
            })
            .catch(error => console.log(error))
    }, [])

    const handleNotificationClick = () => {
        console.log('Click Notification')
    }

    const onRefresh = () => {
        getProducts()

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
                        onPress={handleNotificationClick}>
                        <Ion
                            name="notifications-outline"
                            size={26}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            ),
        })
    }, [])

    return (
        <SafeAreaView style={styles.container}>
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
    container: {
        paddingHorizontal: 10,
        flex: 1,
    },

    adsView: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 10,
        marginTop: 10,
        padding: 10,
    },
})
