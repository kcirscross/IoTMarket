import axios from 'axios'
import React, {useLayoutEffect, useState} from 'react'
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
} from 'react-native'
import {Input} from 'react-native-elements'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'

const RecoverPasswordScreen = ({navigation}) => {
    const [email, setEmail] = useState('')

    const handleRecoverPassword = async () => {
        await axios({
            method: 'post',
            url: `${API_URL}/auth/forgotpassword`,
            data: {
                email: email,
            },
        })
            .then(res => {
                if (res.status == 200) {
                    Alert.alert('Please check your email.')
                }
            })
            .catch(err => {
                console.log(err.message)
                Alert.alert('Wrong email or password. Please try again.')
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
