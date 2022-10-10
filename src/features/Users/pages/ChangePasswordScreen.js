import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import {useLayoutEffect} from 'react'
import {SafeAreaView} from 'react-native'
import {TouchableWithoutFeedback} from 'react-native'
import {KeyboardAvoidingView} from 'react-native'
import {Keyboard} from 'react-native'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {Input} from 'react-native-elements'
import {useSelector} from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useState} from 'react'
import {TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {Alert} from 'react-native'

const ChangePasswordScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)
    const [currentPassword, setcurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [reNewPassword, setReNewPassword] = useState('')
    const [visiblePassword, setVisiblePassword] = useState(false)

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

    const changePassword = async () => {
        //Validate Password
        if (currentPassword == '' || newPassword == '' || reNewPassword == '') {
            Alert.alert('Please fill in all field.')
        } else if (newPassword != reNewPassword) {
            Alert.alert('Your confirm password is not match.')
        } else {
            try {
                const token = await AsyncStorage.getItem('token')

                axios({
                    method: 'patch',
                    url: `${API_URL}/user/changepassword`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    data: {
                        currentPassword: currentPassword,
                        newPassword: newPassword,
                    },
                }).then(res => {
                    if (res.status == 200) {
                        if (res.status == 200) {
                            Alert.alert('Update password successfully.', '', [
                                {
                                    text: 'OK',
                                    onPress: () => navigation.goBack(),
                                },
                            ])
                        }
                    }
                })
            } catch (error) {
                console.log('Error: ', error)
            }
        }
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{width: '100%', height: '100%'}}>
                    <Input
                        containerStyle={styles.textContainer}
                        label="Current Password"
                        placeholder="Your Current Password"
                        onChangeText={text => setcurrentPassword(text)}
                        labelStyle={styles.labelStyle}
                        secureTextEntry={!visiblePassword}
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
                    />
                    <Input
                        containerStyle={styles.textContainer}
                        label="New Password"
                        placeholder="Your New Password"
                        onChangeText={text => setNewPassword(text)}
                        secureTextEntry={!visiblePassword}
                        labelStyle={styles.labelStyle}
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
                    />
                    <Input
                        containerStyle={styles.textContainer}
                        label="Retype New Password"
                        placeholder="Retype Your New Password"
                        onChangeText={text => setReNewPassword(text)}
                        labelStyle={styles.labelStyle}
                        secureTextEntry={!visiblePassword}
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
                    />

                    <TouchableOpacity
                        onPress={changePassword}
                        style={{
                            ...globalStyles.button,
                            position: 'absolute',
                            bottom: 10,
                            alignSelf: 'center',
                        }}>
                        <Text style={globalStyles.textButton}>
                            Update Password
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default ChangePasswordScreen

const styles = StyleSheet.create({
    textContainer: {
        ...globalStyles.input,
        width: '100%',
    },
    labelStyle: {
        color: 'black',
        fontWeight: 'normal',
    },
})
