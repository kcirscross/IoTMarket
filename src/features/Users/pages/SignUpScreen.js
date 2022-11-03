import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    GoogleSignin,
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin'
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
import Toast from 'react-native-toast-message'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useDispatch} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR, WEB_CLIENT_ID} from '../../../components/constants'
import {patchAPI, postAPI} from '../../../components/utils/base_API'
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

            patchAPI({
                url: 'user/changeonlinestatus',
                data: {
                    status: 'Online',
                },
            }).catch(err => console.log('Change Online Status: ', err))
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
            webClientId: WEB_CLIENT_ID,
        })
    }, [])

    const handleEmailSignUp = () => {
        if (
            email == '' ||
            fullName == '' ||
            password == '' ||
            rePassword == ''
        ) {
            Toast.show({
                type: 'error',
                text1: 'Please fill in all field',
            })
        } else {
            if (password != rePassword) {
                Toast.show({
                    type: 'error',
                    text1: 'Password is not match.',
                })
            } else {
                postAPI({
                    url: 'auth/signup',
                    data: {
                        email: email,
                        password: password,
                        fullName: fullName,
                    },
                })
                    .then(res => {
                        if (res.status === 200) {
                            Alert.alert('Sign up successfully.')

                            storeToken(res.data.token)

                            dispatch(signIn(res.data.data))

                            navigation.replace('BottomNavBar')
                        }
                    })
                    .catch(err => {
                        Alert.alert(
                            'Have something wrong here. Please try again.',
                        )
                        console.log('Sign up: ', err)
                    })
            }
        }
    }

    const handleGoogleSignUp = async () => {
        const {user} = await GoogleSignin.signIn()

        postAPI({
            url: 'auth/google',
            data: {
                email: user.email,
                fullName: user.name,
            },
        })
            .then(res => {
                if (res.status === 200) {
                    Alert.alert('Sign up successfully.')

                    storeToken(res.data.token)

                    dispatch(signIn(res.data.data))

                    navigation.replace('BottomNavBar')
                }
            })
            .catch(err => {
                Alert.alert('Have something wrong here. Please try again.')
                console.log('Sign up: ', err)
            })
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
