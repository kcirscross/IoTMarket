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
import React, {useLayoutEffect, useState} from 'react'
import {PRIMARY_COLOR} from '../../../components/constants'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {Input} from 'react-native-elements'
import firebase from '@react-native-firebase/app'

const RecoverPasswordScreen = ({navigation}) => {
    const [email, setEmail] = useState('')

    const handleRecoverPassword = async () => {
        await firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                Alert.alert(
                    'Success',
                    'Please check your email to recover your password.',
                )
            })
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

    return (
        <SafeAreaView style={globalStyles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={styles.container}>
                    <Image source={require('~/assets/images/logo.jpg')} />
                    <Input
                        placeholder="Email"
                        containerStyle={globalStyles.input}
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                        }}
                        renderErrorMessage={false}
                        onChangeText={text => setEmail(text)}
                    />

                    <TouchableOpacity
                        style={{
                            ...globalStyles.button,
                            marginTop: 20,
                        }}
                        onPress={handleRecoverPassword}>
                        <Text style={globalStyles.textButton}>
                            Recover Password
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default RecoverPasswordScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
})
