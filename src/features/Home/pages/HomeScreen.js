import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React, {useEffect, useLayoutEffect} from 'react'
import {useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {Button, Input} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {CategoryItem} from '../components'
import {ProductItem} from '../../Products/components'

const HomeScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)

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
    ]

    const fakeProducts = [
        {
            productTitle: 'Laptop Dell Latitude 3420',
            productPrice: '11599000',
            productCategory: 'Latop',
            productDescription: 'ASdfasdf',
            productDisplayName: 'Pham Duy',
            productID: 'asdfasdf123',
            productImages: require('~/assets/images/logo.jpg'),
            productOwner: 'asdfaasdf111',
            productStatus: 1,
            productStatusForSell: 'New',
        },
        {
            productTitle: 'Laptop Dell Latitude 3420',
            productPrice: '11599000',
            productCategory: 'Latop',
            productDescription: 'ASdfasdf',
            productDisplayName: 'Pham Duy',
            productID: 'asdfasdf1233',
            productImages: require('~/assets/images/logo.jpg'),
            productOwner: 'asdfaasdf1111',
            productStatus: 1,
            productStatusForSell: 'New',
        },
        {
            productTitle: 'Laptop Dell Latitude 3420',
            productPrice: '11599000',
            productCategory: 'Latop',
            productDescription: 'ASdfasdf',
            productDisplayName: 'Pham Duy',
            productID: 'asdfasdf1235',
            productImages: require('~/assets/images/logo.jpg'),
            productOwner: 'asdfaasdf1115',
            productStatus: 1,
            productStatusForSell: 'New',
        },
        {
            productTitle: 'Laptop Dell Latitude 3420',
            productPrice: '11599000',
            productCategory: 'Latop',
            productDescription: 'ASdfasdf',
            productDisplayName: 'Pham Duy',
            productID: 'asdfasdf1236',
            productImages: require('~/assets/images/logo.jpg'),
            productOwner: 'asdfaasdf1116',
            productStatus: 1,
            productStatusForSell: 'New',
        },
        {
            productTitle: 'Laptop Dell Latitude 3420',
            productPrice: '11599000',
            productCategory: 'Latop',
            productDescription: 'ASdfasdf',
            productDisplayName: 'Pham Duy',
            productID: 'asdfasdf127',
            productImages: require('~/assets/images/logo.jpg'),
            productOwner: 'asdfaasdf1117',
            productStatus: 1,
            productStatusForSell: 'New',
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
                        <Icon name="bell" size={24} color="white" />
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
                        showsHorizontalScrollIndicator={false}
                        style={{
                            paddingVertical: 5,
                        }}>
                        {fakeData.map((data, index) => (
                            <CategoryItem key={index} data={[data, index]} />
                        ))}
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
                        {fakeProducts.map((data, index) => (
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
