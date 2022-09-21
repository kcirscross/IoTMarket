import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { HomeScreen } from '~/features/Home';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../constants';
import { ProductsScreen } from '~/features/Products'
import { UploadProductScreen } from '~/features/Products'
import { ChatsScreen } from '~/features/Chats'
import { SettingScreen } from '~/features/More'

const Tab = createBottomTabNavigator()

const screenOptions = () => ({
    tabBarStyle: {
        position: 'absolute',
        bottom: 10,
        backgroundColor: SECONDARY_COLOR,
        height: 50,
        justifyContent: 'center',
        ...styles.shadow,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    headerStyle: { backgroundColor: PRIMARY_COLOR },
    headerTitleStyle: {
        color: "white",
    },
    hearderTintColor: "white",
    headerTitleAlign: 'center',
    headerShown: false
})

const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity style={{
        top: -15,
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.shadow
    }}
        onPress={onPress}>
        <View style={{
            width: 64,
            height: 64,
            borderRadius: 35,
            marginHorizontal: 5,
            backgroundColor: 'white'
        }}>
            {children}
        </View>
    </TouchableOpacity>
)

const BottomNavBar = () => {
    return (
        <Tab.Navigator screenOptions={screenOptions} initialRouteName='Home'>
            <Tab.Screen name='Home' component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.viewContainer}>
                            <Icon name='home' size={24}
                                color={focused ? PRIMARY_COLOR : 'black'} />
                        </View>
                    )
                }}
            />
            <Tab.Screen name='Products' component={ProductsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.viewContainer}>
                            <Icon name='store' size={24}
                                color={focused ? PRIMARY_COLOR : 'black'} />
                        </View>
                    )
                }} />
            <Tab.Screen name='UploadProduct' component={UploadProductScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icon name='plus-circle' size={62}
                            color={focused ? PRIMARY_COLOR : 'black'} />
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    )
                }} />
            <Tab.Screen name='Chats' component={ChatsScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icon name='comment-alt' size={24}
                            color={focused ? PRIMARY_COLOR : 'black'}
                            solid={true} />
                    )
                }} />
            <Tab.Screen name='More' component={SettingScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Icon name='cog' size={24}
                            color={focused ? PRIMARY_COLOR : 'black'} />
                    )
                }} />
        </Tab.Navigator>
    )
}

export default BottomNavBar

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    viewContainer: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    hideTabNavigation: {
        display: 'none'
    }
})