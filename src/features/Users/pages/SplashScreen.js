import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, {useEffect} from 'react'
import {Alert} from 'react-native'
import {Image, SafeAreaView, StyleSheet} from 'react-native'
import {globalStyles} from '~/assets/styles/globalStyles'
import {API_URL} from '../../../components/constants'
import {signIn} from '../userSlice'
import {useDispatch} from 'react-redux'

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
                    axios({
                        method: 'post',
                        url: `${API_URL}/auth/google`,
                        data: {
                            email: storedEmail,
                            fullName: storedPassword,
                        },
                    })
                        .then(async res => {
                            if (res.data.statusCode == 200) {
                                const action = signIn(res.data.data)
                                dispatch(action)

                                navigation.replace('BottomNavBar')
                            }
                        })
                        .catch(err => {
                            Alert.alert(
                                'Have something wrong here. Please try again.',
                            ),
                                console.log(err.message)
                        })

                storedAccountType == 'Email' &&
                    axios({
                        method: 'post',
                        url: `${API_URL}/auth/signin`,
                        data: {
                            email: storedEmail,
                            password: storedPassword,
                        },
                    })
                        .then(async res => {
                            if ((res.data.statusCode = 200)) {
                                const action = signIn(res.data.data)
                                dispatch(action)

                                navigation.replace('BottomNavBar')
                            }
                        })
                        .catch(err => {
                            console.log(err.message)
                            Alert.alert(
                                'Wrong email or password. Please try again.',
                            )
                        })
            } else {
                setTimeout(() => {
                    navigation.navigate('SignIn')
                }, 2000)
            }
        } catch (error) {
            console.log('Error when get data', error)
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
