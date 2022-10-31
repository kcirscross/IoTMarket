import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import axios from 'axios'
import React, {useEffect} from 'react'
import {Alert, Image, SafeAreaView, StyleSheet} from 'react-native'
import {useDispatch} from 'react-redux'
import {globalStyles} from '~/assets/styles/globalStyles'
import {API_URL} from '../../../components/constants'
import {getFavorite} from '../../Products/favoriteSlice'
import {signIn} from '../userSlice'

const SplashScreen = ({navigation}) => {
    const dispatch = useDispatch()

    const autoSignIn = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('account')
            const storedPassword = await AsyncStorage.getItem('password')
            const storedAccountType = await AsyncStorage.getItem('accountType')

            if (
                storedPassword != null &&
                storedEmail != null &&
                storedAccountType != null
            ) {
                if (storedAccountType == 'Google') {
                    await messaging().registerDeviceForRemoteMessages()
                    const tokenFCM = await messaging().getToken()

                    axios({
                        method: 'post',
                        url: `${API_URL}/auth/google`,
                        headers: {
                            deviceTokenFCM: tokenFCM,
                        },
                        data: {
                            email: storedEmail,
                            fullName: storedPassword,
                        },
                    })
                        .then(async res => {
                            if (res.data.statusCode == 200) {
                                const action = signIn(res.data.data)
                                dispatch(action)

                                getFavoriteAfterSignIn()

                                navigation.replace('BottomNavBar')

                                await AsyncStorage.setItem(
                                    'token',
                                    res.data.data.deviceToken,
                                )
                            }
                        })
                        .catch(err => {
                            Alert.alert(
                                'Have something wrong here. Please try again.',
                            ),
                                console.log(err.message)
                        })
                }

                if (storedAccountType == 'Email') {
                    await messaging().registerDeviceForRemoteMessages()
                    const tokenFCM = await messaging().getToken()
                    axios({
                        method: 'post',
                        url: `${API_URL}/auth/signin`,
                        headers: {
                            deviceTokenFCM: tokenFCM,
                        },
                        data: {
                            email: storedEmail,
                            password: storedPassword,
                        },
                    })
                        .then(async res => {
                            if ((res.data.statusCode = 200)) {
                                const action = signIn(res.data.data)

                                dispatch(action)

                                getFavoriteAfterSignIn()

                                navigation.replace('BottomNavBar')

                                await AsyncStorage.setItem(
                                    'token',
                                    res.data.data.deviceToken,
                                )
                            }
                        })
                        .catch(err => {
                            console.log(err.message)
                            Alert.alert(
                                'Wrong email or password. Please try again.',
                                '',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () =>
                                            navigation.replace('SignIn'),
                                    },
                                ],
                            )
                        })
                }
            } else {
                setTimeout(() => {
                    navigation.navigate('SignIn')
                }, 2000)
            }
        } catch (error) {
            console.log('Error when get data', error)
        }
    }

    const getFavoriteAfterSignIn = async () => {
        try {
            const token = await AsyncStorage.getItem('token')

            axios({
                method: 'get',
                url: `${API_URL}/user/favorite`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }).then(res => dispatch(getFavorite(res.data.favorites)))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        autoSignIn()
    }, [])

    return (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                ...styles.container,
            }}>
            <Image source={require('~/assets/images/logo.jpg')} />
        </SafeAreaView>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})
