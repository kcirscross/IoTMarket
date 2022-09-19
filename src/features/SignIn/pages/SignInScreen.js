import { Image, Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../../assets/styles/globalStyles'
import Icon from 'react-native-vector-icons/FontAwesome5';

const SignInScreen = () => {
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

                    <View style={{
                        width: "100%",
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TextInput placeholder='Email'
                            style={globalStyles.input}
                        />

                        <TextInput placeholder='Password' secureTextEntry={true}
                            style={globalStyles.input}
                        />

                        <TouchableOpacity style={globalStyles.button}>
                            <Text style={globalStyles.textButton}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

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
                        }}>
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

                            <TouchableOpacity>
                                <Text style={{
                                    ...globalStyles.textButton,
                                    color: '#63A1FF'
                                }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
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
    }
})