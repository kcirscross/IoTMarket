import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {useEffect} from 'react'
import {Alert, Image, SafeAreaView, StyleSheet} from 'react-native'
import {useDispatch} from 'react-redux'
import {globalStyles} from '~/assets/styles/globalStyles'
import {getAPI, postAPI} from '../../../components/utils/base_API'
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
                storedAccountType == 'Google' &&
                    postAPI({
                        url: 'auth/google',
                        data: {
                            email: storedEmail,
                            fullName: storedPassword,
                        },
                    })
                        .then(async res => {
                            if (res.status === 200) {
                                dispatch(signIn(res.data.data))

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
                                console.log('Auto Login: ', err)
                        })

                storedAccountType == 'Email' &&
                    postAPI({
                        url: 'auth/signin',
                        data: {
                            email: storedEmail,
                            password: storedPassword,
                        },
                    })
                        .then(async res => {
                            if (res.status === 200) {
                                dispatch(signIn(res.data.data))

                                getFavoriteAfterSignIn()

                                navigation.replace('BottomNavBar')

                                await AsyncStorage.setItem(
                                    'token',
                                    res.data.data.deviceToken,
                                )
                            }
                        })
                        .catch(err => {
                            console.log('Auto Login: ', err)
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
            } else {
                setTimeout(() => {
                    navigation.replace('SignIn')
                }, 2000)
            }
        } catch (error) {
            console.log('Error when get data', error)
        }
    }

    const getFavoriteAfterSignIn = () => {
        getAPI({url: 'user/favorite'})
            .then(
                res =>
                    res.status === 200 &&
                    dispatch(getFavorite(res.data.favorites)),
            )
            .catch(err => console.log('Get Favorite: ', err))
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
        backgroundColor: 'white',
    },
})
