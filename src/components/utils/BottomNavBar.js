import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import React from 'react'
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Ion from 'react-native-vector-icons/Ionicons'
import MaterialCom from 'react-native-vector-icons/MaterialCommunityIcons'
import {useSelector} from 'react-redux'
import {HomeScreen} from '~/features/Home'
import {MoreScreen} from '~/features/More'
import {UploadProductScreen} from '~/features/Products'
import {OrderScreen} from '../../features/More'
import ProfileScreen from '../../features/Users/pages/ProfileScreen'
import {PRIMARY_COLOR} from '../constants'

const Tab = createBottomTabNavigator()

const screenOptions = () => ({
    tabBarStyle: {
        backgroundColor: 'white',
        height: 60,
        justifyContent: 'center',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    headerStyle: {backgroundColor: PRIMARY_COLOR},
    headerTitleStyle: {
        color: 'white',
    },
    hearderTintColor: 'white',
    headerTitleAlign: 'center',
    headerShown: false,
})

const CustomTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
        style={{
            top: -15,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        onPress={onPress}>
        <View
            style={{
                width: 64,
                height: 64,
                borderRadius: 35,
                marginHorizontal: 5,
                backgroundColor: 'white',
            }}>
            {children}
        </View>
    </TouchableOpacity>
)

const BottomNavBar = () => {
    const currentUser = useSelector(state => state.user)

    return (
        <Tab.Navigator screenOptions={screenOptions} initialRouteName="Home">
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <View style={styles.viewContainer}>
                            {/* <Ion
                                name={focused ? 'home' : 'home-outline'}
                                size={focused ? 40 : 30}
                                color={focused ? PRIMARY_COLOR : 'black'}
                            /> */}

                            <Image
                                source={
                                    focused
                                        ? require('~/assets/images/homeFocused.png')
                                        : require('~/assets/images/home.png')
                                }
                                style={{
                                    width: focused ? 36 : 30,
                                    height: focused ? 36 : 30,
                                }}
                                resizeMethod="resize"
                                resizeMode="contain"
                            />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                initialParams={{
                    0:
                        currentUser.storeId != undefined
                            ? currentUser.storeId
                            : currentUser._id,
                }}
                options={{
                    tabBarIcon: ({focused}) => (
                        <View style={styles.viewContainer}>
                            {/* <MaterialCom
                                name={
                                    focused
                                        ? 'storefront'
                                        : 'storefront-outline'
                                }
                                size={focused ? 40 : 32}
                                color={focused ? PRIMARY_COLOR : '#323232'}
                            /> */}
                            <Image
                            source={
                                focused
                                    ? require('~/assets/images/profileFocused.png')
                                    : require('~/assets/images/profile.png')
                            }
                            style={{
                                width: focused ? 36 : 30,
                                height: focused ? 36 : 30,
                            }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="UploadProduct"
                component={UploadProductScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon
                            name="plus-circle"
                            size={62}
                            color={PRIMARY_COLOR}
                        />
                    ),
                    tabBarButton: props => <CustomTabBarButton {...props} />,
                }}
            />
            <Tab.Screen
                name="Order"
                component={OrderScreen}
                initialParams={[{from: 'buyer'}]}
                options={{
                    tabBarIcon: ({focused}) => (
                        // <Ion
                        //     name={focused ? 'reader' : 'reader-outline'}
                        //     size={focused ? 40 : 30}
                        //     color={focused ? PRIMARY_COLOR : 'black'}
                        //     solid={true}
                        // />
                        <Image
                                source={
                                    focused
                                        ? require('~/assets/images/orderFocused.png')
                                        : require('~/assets/images/order.png')
                                }
                                style={{
                                    width: focused ? 36 : 30,
                                    height: focused ? 36 : 30,
                                }}
                                resizeMethod="resize"
                                resizeMode="contain"
                            />
                    ),
                }}
            />
            <Tab.Screen
                name="More"
                component={MoreScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        // <Ion
                        //     name={focused ? 'settings' : 'settings-outline'}
                        //     size={focused ? 42 : 32}
                        //     color={focused ? PRIMARY_COLOR : '#323232'}
                        // />

                        <Image
                            source={
                                focused
                                    ? require('~/assets/images/settingFocused.png')
                                    : require('~/assets/images/setting.png')
                            }
                            style={{
                                width: focused ? 36 : 30,
                                height: focused ? 36 : 30,
                            }}
                            resizeMethod="resize"
                            resizeMode="contain"
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomNavBar

const styles = StyleSheet.create({
    viewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    hideTabNavigation: {
        display: 'none',
    },
})
