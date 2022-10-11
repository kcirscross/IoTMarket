import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin'
import axios from 'axios'
import React, {useEffect, useState} from 'react'
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
import {useDispatch, useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL} from '../../../components/constants'
import {signIn} from '../userSlice'

const SignInScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [visiblePassword, setVisiblePassword] = useState(false)
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [rememberCheckbox, setRememberCheckbox] = useState(false)

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

    //Config for Google Sign In
    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '550636790404-jkka629ik6ag2jdh7rpajr3luctuf2nd.apps.googleusercontent.com',
        })

        GoogleSignin.signOut()
    }, [])

    //Function Remember Account
    const rememberAccount = async (storeEmail, storePassword, accountType) => {
        try {
            await AsyncStorage.setItem('account', storeEmail)
            await AsyncStorage.setItem('password', storePassword)
            await AsyncStorage.setItem('accountType', accountType)
        } catch (error) {
            console.log('Error when storing data', error)
        }
    }

    const handleGoogleSignUp = async () => {
        const {user} = await GoogleSignin.signIn()

        axios({
            method: 'post',
            url: `${API_URL}/auth/google`,
            data: {
                email: user.email,
                fullName: user.name,
            },
        })
            .then(res => {
                if (res.data.statusCode == 200) {
                    storeToken(res.data.token)

                    const action = signIn(res.data.data)
                    dispatch(action)

                    rememberAccount(user.email, user.name, 'Google')

                    navigation.replace('BottomNavBar')
                }
            })
            .catch(err =>
                Alert.alert('Have something wrong here. Please try again.'),
            )
    }

    const handleEmailSignIn = async () => {
        if (email == '' || password == '') {
            return Alert.alert('Error', 'Please fill in all field.')
        } else {
            axios({
                method: 'post',
                url: `${API_URL}/auth/signin`,
                data: {
                    email: email,
                    password: password,
                },
            })
                .then(res => {
                    if ((res.data.statusCode = 200)) {
                        storeToken(res.data.token)

                        const action = signIn(res.data.data)
                        dispatch(action)

                        rememberCheckbox &&
                            rememberAccount(email, password, 'Email')

                        navigation.replace('BottomNavBar')
                    }
                })
                .catch(err => {
                    console.log(err.message)
                    Alert.alert('Wrong email or password. Please try again.')
                })
        }
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
                    style={{
                        ...styles.container,
                        width: '100%',
                    }}>
                    <Image source={require('~/assets/images/logo.jpg')} />
                    <Text style={globalStyles.textTitle}>
                        Welcome to, IoTMarket
                    </Text>
                    <Text>Enter your account to continue.</Text>

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
                            placeholder="Password"
                            secureTextEntry={!visiblePassword}
                            containerStyle={globalStyles.input}
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                            }}
                            renderErrorMessage={false}
                            onChangeText={text => setPassword(text)}
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
                        />

                        <TouchableOpacity
                            onPress={() =>
                                setRememberCheckbox(!rememberCheckbox)
                            }
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            {!rememberCheckbox ? (
                                <Icon name="square" size={24} color="black" />
                            ) : (
                                <Icon
                                    name="check-square"
                                    size={24}
                                    color="black"
                                />
                            )}
                            <Text
                                style={{
                                    color: 'black',
                                    marginLeft: 10,
                                    marginRight: 160,
                                    marginVertical: 10,
                                }}>
                                Remember Account
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={globalStyles.button}
                            onPress={handleEmailSignIn}>
                            <Text style={globalStyles.textButton}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            marginTop: 50,
                            width: '100%',
                            alignItems: 'center',
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

                        <View
                            style={{
                                borderRadius: 10,
                                width: '100%',
                            }}>
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

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 50,
                            }}>
                            <Text>Don't have an account? </Text>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('SignUp')}>
                                <Text
                                    style={{
                                        ...globalStyles.textButton,
                                        color: '#63A1FF',
                                    }}>
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('RecoverPassword')
                            }>
                            <Text
                                style={{
                                    ...globalStyles.textButton,
                                    color: '#FF8164',
                                    marginTop: 10,
                                }}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default SignInScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    horizontalLine: {
        backgroundColor: '#D9D9D9',
        height: 5,
        width: '37%',
        marginHorizontal: 20,
        borderRadius: 10,
    },
    textContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
})
