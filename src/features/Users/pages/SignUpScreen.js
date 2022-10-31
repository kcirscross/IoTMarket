import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin'
import axios from 'axios'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import {Input} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useDispatch} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import {signIn} from '../userSlice'

const SignUpScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [visiblePassword, setVisiblePassword] = useState(false)
    const dispatch = useDispatch()

    const storeToken = async token => {
        try {
            await AsyncStorage.setItem('token', token)
            axios({
                method: 'patch',
                url: `${API_URL}/user/changeonlinestatus`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
                data: {
                    status: 'Online',
                },
            })
        } catch (error) {
            console.log('Error when store token.', error)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '550636790404-jkka629ik6ag2jdh7rpajr3luctuf2nd.apps.googleusercontent.com',
        })
    }, [])

    const handleEmailSignUp = async () => {
        if (
            email == '' ||
            fullName == '' ||
            password == '' ||
            rePassword == ''
        ) {
            Alert.alert('Error', 'Please fill in all field.')
            return
        } else {
            if (password != rePassword) {
                Alert.alert('Error', 'Password is not match.')
                return
            } else {
                await messaging().registerDeviceForRemoteMessages()
                const tokenFCM = await messaging().getToken()

                axios({
                    method: 'post',
                    url: `${API_URL}/auth/signup`,
                    headers: {
                        deviceTokenFCM: tokenFCM,
                    },
                    data: {
                        email: email,
                        password: password,
                        fullName: fullName,
                    },
                })
                    .then(res => {
                        if (res.data.statusCode == 200) {
                            Alert.alert('Sign up successfully.')

                            storeToken(res.data.token)

                            const action = signIn(res.data.data)
                            dispatch(action)

                            navigation.replace('BottomNavBar')
                        }
                    })
                    .catch(err =>
                        Alert.alert(
                            'Have something wrong here. Please try again.',
                        ),
                    )
            }
        }
    }

    const handleGoogleSignUp = async () => {
        const {user} = await GoogleSignin.signIn()

        await messaging().registerDeviceForRemoteMessages()
        const tokenFCM = await messaging().getToken()

        axios({
            method: 'post',
            url: `${API_URL}/auth/google`,
            headers: {
                deviceTokenFCM: tokenFCM,
            },
            data: {
                email: user.email,
                fullName: user.name,
            },
        })
            .then(res => {
                if (res.data.statusCode == 200) {
                    Alert.alert('Sign up successfully.')

                    storeToken(res.data.token)

                    const action = signIn(res.data.data)
                    dispatch(action)

                    navigation.replace('BottomNavBar')
                }
            })
            .catch(err =>
                Alert.alert('Have something wrong here. Please try again.'),
            )
    }

    return (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                ...styles.container,
            }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={styles.container}>
                    <Image
                        source={require('~/assets/images/logo.jpg')}
                        style={styles.logo}
                    />

                    <View style={styles.textContainer}>
                        <Input
                            placeholder="Email"
                            containerStyle={globalStyles.input}
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                            }}
                            renderErrorMessage={false}
                            onChangeText={text => setEmail(text)}
                        />
                        <Input
                            placeholder="Full Name"
                            containerStyle={globalStyles.input}
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                            }}
                            renderErrorMessage={false}
                            onChangeText={text => setFullName(text)}
                        />
                        <Input
                            placeholder="Password"
                            secureTextEntry={!visiblePassword}
                            containerStyle={globalStyles.input}
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                            }}
                            renderErrorMessage={false}
                            rightIcon={
                                <TouchableOpacity
                                    onPress={() =>
                                        setVisiblePassword(!visiblePassword)
                                    }>
                                    {!visiblePassword ? (
                                        <Icon name="eye-slash" size={20} />
                                    ) : (
                                        <Icon name="eye" size={20} />
                                    )}
                                </TouchableOpacity>
                            }
                            onChangeText={text => setPassword(text)}
                        />
                        <Input
                            placeholder="Retype Password"
                            secureTextEntry={!visiblePassword}
                            containerStyle={globalStyles.input}
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                            }}
                            renderErrorMessage={false}
                            rightIcon={
                                <TouchableOpacity
                                    onPress={() =>
                                        setVisiblePassword(!visiblePassword)
                                    }>
                                    {!visiblePassword ? (
                                        <Icon name="eye-slash" size={20} />
                                    ) : (
                                        <Icon name="eye" size={20} />
                                    )}
                                </TouchableOpacity>
                            }
                            onChangeText={text => setRePassword(text)}
                        />
                    </View>

                    <TouchableOpacity
                        style={globalStyles.button}
                        onPress={handleEmailSignUp}>
                        <Text style={globalStyles.textButton}>Sign Up</Text>
                    </TouchableOpacity>

                    <View
                        style={{
                            marginTop: 50,
                            width: '100%',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                            }}>
                            <View style={styles.horizontalLine} />
                            <Text>or</Text>
                            <View style={styles.horizontalLine} />
                        </View>

                        <View style={{borderRadius: 10}}>
                            <GoogleSigninButton
                                style={{
                                    width: '90%',
                                    height: 60,
                                    alignSelf: 'center',
                                    borderRadius: 10,
                                    marginTop: 10,
                                }}
                                size={GoogleSigninButton.Size.Wide}
                                color={GoogleSigninButton.Color.Dark}
                                onPress={handleGoogleSignUp}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },

    textContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },

    horizontalLine: {
        backgroundColor: '#D9D9D9',
        height: 5,
        width: '37%',
        marginHorizontal: 20,
        borderRadius: 10,
    },
})
