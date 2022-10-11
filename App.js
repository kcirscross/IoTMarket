import AsyncStorage from '@react-native-async-storage/async-storage'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {isAllOf} from '@reduxjs/toolkit'
import axios from 'axios'
import React, {useEffect} from 'react'
import {useRef} from 'react'
import {useState} from 'react'
import {AppState, StyleSheet} from 'react-native'
import {Provider, useDispatch, useSelector} from 'react-redux'
import {API_URL} from './src/components/constants'
import BottomNavBar from './src/components/utils/BottomNavBar'
import {HomeScreen} from './src/features/Home'
import MoreScreen from './src/features/More/pages/MoreScreen'
import {ProductDetail} from './src/features/Products'
import {ProductItem} from './src/features/Products/components'
import {
    ChangeAddressScreen,
    ChangeInfoScreen,
    ChangePasswordScreen,
    ProfileScreen,
    RecoverPasswordScreen,
    SignInScreen,
    SignUpScreen,
    SplashScreen,
} from './src/features/Users'
import {updateOnlineStatus} from './src/features/Users/userSlice'
import {store} from './store'

const Stack = createNativeStackNavigator()
const globalSreenOptions = {
    headerShown: false,
}

export default function App() {
    const [onlineStatus, setOnlineStatus] = useState('')

    useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange)

        return () => {
            AppState.removeEventListener('change', _handleAppStateChange)
        }
    }, [])

    const _handleAppStateChange = async () => {
        if (AppState.currentState == 'active') {
            try {
                const token = await AsyncStorage.getItem('token')
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/changeonlinestatus`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    data: {
                        status: 'Online',
                    },
                }).then(res => {
                    if (res.status == 200) {
                        setOnlineStatus('Online')
                    }
                })
            } catch (error) {
                console.log('Error', error.message)
            }
        } else {
            try {
                const token = await AsyncStorage.getItem('token')
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/changeonlinestatus`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    data: {
                        status: 'Offline',
                    },
                }).then(res => {
                    if (res.status == 200) {
                        setOnlineStatus('Offline')
                    }
                })
            } catch (error) {
                console.log('Error', error.message)
            }
        }
    }

    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={globalSreenOptions}
                    initialRouteName="Splash">
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen
                        name="RecoverPassword"
                        component={RecoverPasswordScreen}
                    />
                    <Stack.Screen
                        name="BottomNavBar"
                        component={BottomNavBar}
                    />
                    <Stack.Screen name="ProductItem" component={ProductItem} />
                    <Stack.Screen
                        name="ProductDetail"
                        component={ProductDetail}
                    />
                    <Stack.Screen name="More" component={MoreScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen
                        name="ChangeInfo"
                        component={ChangeInfoScreen}
                    />
                    <Stack.Screen
                        name="ChangeAddress"
                        component={ChangeAddressScreen}
                    />
                    <Stack.Screen
                        name="ChangePassword"
                        component={ChangePasswordScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}

const styles = StyleSheet.create({})
