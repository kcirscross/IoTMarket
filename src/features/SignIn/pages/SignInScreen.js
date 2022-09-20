import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { globalStyles } from '../../../assets/styles/globalStyles';

const SignInScreen = ({ navigation }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [visiblePassword, setVisiblePassword] = useState(false)

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '550636790404-jkka629ik6ag2jdh7rpajr3luctuf2nd.apps.googleusercontent.com',
        });
    }, []);

    const handleGoogleSignUp = async () => {
        const { idToken } = await GoogleSignin.signIn()
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential).then(() => {
            navigation.navigate('Home');
        });
    };

    const handleEmailSignIn = async () => {

        if (email == '' || password == '') {
            Alert.alert('Error', 'Please fill in all field.');
            return;
        } else {
            auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                    navigation.navigate('Home')
                })
                .catch((error) => alert(error))
        }
    };

    return (
        <SafeAreaView style={{
            ...globalStyles.container,
            ...styles.container
        }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior='padding' style={{
                    ...styles.container,
                    width: '100%',
                }}>

                    <Image source={require('~/assets/images/logo.jpg')} />
                    <Text style={globalStyles.textTitle}>Welcome to, IoTMarket</Text>
                    <Text>Enter your account to continue.</Text>

                    <View style={styles.textContainer}>
                        <Input placeholder='Email'
                            containerStyle={globalStyles.input}
                            inputContainerStyle={{
                                borderBottomWidth: 0
                            }}
                            renderErrorMessage={false}
                            onChangeText={(text) => setEmail(text)} />

                        <Input placeholder='Password'
                            secureTextEntry={!visiblePassword}
                            containerStyle={globalStyles.input}
                            inputContainerStyle={{
                                borderBottomWidth: 0
                            }}
                            renderErrorMessage={false}
                            onChangeText={(text) => setPassword(text)}
                            rightIcon={
                                <TouchableOpacity onPress={() => setVisiblePassword(!visiblePassword)}>
                                    {!visiblePassword ? <Icon name='eye-slash' size={20} />
                                        : <Icon name='eye' size={20} />}
                                </TouchableOpacity>
                            } />

                        <TouchableOpacity style={globalStyles.button} onPress={handleEmailSignIn}>
                            <Text style={globalStyles.textButton}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        marginTop: 50,
                        width: "100%",
                        alignItems: 'center'
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

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 50
                        }}>
                            <Text>Don't have an account? </Text>

                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={{
                                    ...globalStyles.textButton,
                                    color: '#63A1FF'
                                }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('RecoverPassword')}>
                            <Text style={{
                                ...globalStyles.textButton,
                                color: '#FF8164',
                                marginTop: 10
                            }}>Forgot Password?</Text>
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
        alignItems: 'center'
    },

    horizontalLine: {
        backgroundColor: '#D9D9D9',
        height: 5,
        width: "37%",
        marginHorizontal: 20,
        borderRadius: 10
    },
    textContainer: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    }
})