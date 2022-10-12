import axios from 'axios'
import React, {useLayoutEffect} from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
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
import {useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import {ProductItem} from '../../Products/components'
import {CategoryItem} from '../components'

const HomeScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)

    const [listProducts, setListProducts] = useState([])

    useEffect(() => {
        try {
            axios({
                method: 'get',
                url: `${API_URL}/product`,
            }).then(res => {
                setListProducts(res.data.products)
            })
        } catch (error) {}
    }, [])

    const fakeData = [
        {
            categoryName: 'PC',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
        {
            categoryName: 'Laptop',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
        {
            categoryName: 'Phone',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
        {
            categoryName: 'Item PC',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
        {
            categoryName: 'Item Phone',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
        {
            categoryName: 'Item Phone',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
        {
            categoryName: 'Item Phone',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
        {
            categoryName: 'Item Phone',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
        {
            categoryName: 'Item Phone',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
        {
            categoryName: 'Item Phone',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
        {
            categoryName: 'Item Phone',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
        {
            categoryName: 'Item Phone',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
        {
            categoryName: 'Item Phone',
            categoryImage: require('~/assets/images/logo.jpg'),
        },
    ]

    const handleNotificationClick = () => {
        console.log('Click Notification')
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
                        width: 350,
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
                    <TouchableOpacity onPress={handleNotificationClick}>
                        <Icon name="bell" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            ),
        })
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                <View
                    style={{
                        marginTop: 5,
                    }}>
                    <Text style={globalStyles.textTitle}>Categories</Text>

                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <FlatList
                            numColumns={Math.ceil(fakeData.length / 2)}
                            scrollEnabled={false}
                            contentContainerStyle={{
                                alignSelf: 'flex-start',
                            }}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={fakeData}
                            renderItem={({item, index}) => (
                                <CategoryItem
                                    data={[item, index, fakeData.length]}
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
