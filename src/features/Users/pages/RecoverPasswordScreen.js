import React, {useLayoutEffect, useState} from 'react'
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native'
import {Input} from 'react-native-elements'
import Toast from 'react-native-toast-message'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {postAPI} from '../../../components/utils/base_API'

const RecoverPasswordScreen = ({navigation}) => {
    const [email, setEmail] = useState('')

    const handleRecoverPassword = () => {
        postAPI({
            url: 'auth/forgotpassword',
            data: {
                email: email,
            },
        })
            .then(res => {
                res.status === 200 &&
                    Toast.show({
                        type: 'success',
                        text1: 'Please check your email.',
                    })
            })
            .catch(err => {
                Toast.show({
                    type: 'success',
                    text1: 'Wrong email or password. Please try again.',
                })

                console.log('Recover Password: ', err)
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
                    <Toast position="bottom" bottomOffset={70} />

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
