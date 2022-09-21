import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { globalStyles } from '../../../assets/styles/globalStyles';
import { PRIMARY_COLOR } from '../../../components/constants';
import firebase from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const SignUpScreen = ({ navigation }) => {

    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [visiblePassword, setVisiblePassword] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerStyle: { backgroundColor: PRIMARY_COLOR },
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white'
            }
        })
    }, []);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '550636790404-jkka629ik6ag2jdh7rpajr3luctuf2nd.apps.googleusercontent.com',
        });
    }, []);

    const handleEmailSignUp = () => {
        if (email == '' || fullName == '' || password == '' || rePassword == '') {
            Alert.alert('Error', 'Please fill in all field.');
            return;
        } else {
            if (password != rePassword) {
                Alert.alert('Error', 'Password is not match.');
                return;
            } else {
                firebase.auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        console.log('User account created & signed in!');
                        navigation.replace('BottomNavBar')
                    })
                    .catch(error => {
                        if (error.code === 'auth/email-already-in-use') {
                            Alert.alert('Error', 'That email address is already in use!');
                        }

                        if (error.code === 'auth/invalid-email') {
                            Alert.alert('Error', 'That email address is invalid!');
                        }

                        if (error.code === 'auth/weak-password') {
                            Alert.alert('Error', 'You need a stronger password!');
                        }
                        console.error(error);
                    });
            }
        }
    };

    const handleGoogleSignUp = async () => {
        const { idToken } = await GoogleSignin.signIn()
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential).then(() => {
            navigation.navigate('Home');
        });
    };

    return (
        <SafeAreaView style={{
            ...globalStyles.container,
            ...styles.container
        }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior='padding'
                    style={styles.container}>
                    <Image source={require('~/assets/images/logo.jpg')}
                        style={styles.logo} />

                    <View style={styles.textContainer}>
                        <Input placeholder='Email'
                            containerStyle={globalStyles.input}
                            inputContainerStyle={{
                                borderBottomWidth: 0
                            }}
                            renderErrorMessage={false}
                            onChangeText={(text) => setEmail(text)} />
                        <Input placeholder='Full Name'
                            containerStyle={globalStyles.input}
                            inputContainerStyle={{
                                borderBottomWidth: 0
                            }}
                            renderErrorMessage={false}
                            onChangeText={(text) => setFullName(text)} />
                        <Input placeholder='Password'
                            secureTextEntry={!visiblePassword}
                            containerStyle={globalStyles.input}
                            inputContainerStyle={{
                                borderBottomWidth: 0
                            }}
                            renderErrorMessage={false}
                            rightIcon={
                                <TouchableOpacity onPress={() => setVisiblePassword(!visiblePassword)}>
                                    {!visiblePassword ? <Icon name='eye-slash' size={20} />
                                        : <Icon name='eye' size={20} />}
                                </TouchableOpacity>
                            }
                            onChangeText={(text) => setPassword(text)} />
                        <Input placeholder='Retype Password'
                            secureTextEntry={!visiblePassword}
                            containerStyle={globalStyles.input}
                            inputContainerStyle={{
                                borderBottomWidth: 0
                            }}
                            renderErrorMessage={false}
                            rightIcon={
                                <TouchableOpacity onPress={() => setVisiblePassword(!visiblePassword)}>
                                    {!visiblePassword ? <Icon name='eye-slash' size={20} />
                                        : <Icon name='eye' size={20} />}
                                </TouchableOpacity>
                            }
                            onChangeText={(text) => setRePassword(text)} />
                    </View>

                    <TouchableOpacity style={globalStyles.button} onPress={handleEmailSignUp}>
                        <Text style={globalStyles.textButton}>Sign Up</Text>
                    </TouchableOpacity>

                    <View style={{
                        marginTop: 50,
                        width: "100%"
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            width: "100%",
                            alignItems: 'center'
                        }}>
                            <View style={styles.horizontalLine} />
                            <Text>or</Text>
                            <View style={styles.horizontalLine} />
                        </View>

                        <TouchableOpacity style={{
                            ...globalStyles.button,
                            backgroundColor: '#FF6060',
                            flexDirection: 'row',
                            alignSelf: 'center'
                        }}
                            onPress={handleGoogleSignUp}>
                            <Icon name='google' size={22} style={{
                                position: 'absolute',
                                left: 10
                            }}
                                color='white'
                            />
                            <Text style={globalStyles.textButton}>Continue with Google</Text>
                        </TouchableOpacity>
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
        height: '100%'
    },

    textContainer: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },

    horizontalLine: {
        backgroundColor: '#D9D9D9',
        height: 5,
        width: "37%",
        marginHorizontal: 20,
        borderRadius: 10
    },
})