import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {useLayoutEffect, useState} from 'react'
import {
    Alert,
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
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useDispatch, useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {patchAPI, postAPI} from '../../../components/utils/base_API'
import {signOut} from '../userSlice'

const ChangePasswordScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)
    const [currentPassword, setcurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [reNewPassword, setReNewPassword] = useState('')
    const [visiblePassword, setVisiblePassword] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const dispatch = useDispatch()

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

    const deleteRememberAccount = () => {
        patchAPI({
            url: 'user/changeonlinestatus',
            data: {status: 'Offline'},
        })
            .then(async res => {
                if (res.status === 200) {
                    await AsyncStorage.removeItem('account')
                    await AsyncStorage.removeItem('password')
                    await AsyncStorage.removeItem('accountType')
                    await AsyncStorage.removeItem('token')
                }
            })
            .catch(err => console.log('Logout: ', err))
    }

    const changePassword = async () => {
        //Validate Password
        if (currentPassword == '' || newPassword == '' || reNewPassword == '') {
            Toast.show({
                type: 'success',
                text1: 'Your password is invalid.',
            })
        } else if (newPassword != reNewPassword) {
            Toast.show({
                type: 'success',
                text1: 'Your confirm password is not match.',
            })
        } else {
            setModalLoading(true)

            patchAPI({
                url: 'user/changepassword',
                data: {
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                },
            }).then(res => {
                if (res.status === 200) {
                    setModalLoading(false)

                    Alert.alert(
                        'Update password successfully. Please sign in again.',
                        '',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    postAPI({
                                        url: 'auth/logout',
                                        data: {
                                            email: currentUser.email,
                                        },
                                    })
                                        .then(res => {
                                            res.status === 200 &&
                                                dispatch(signOut())

                                            deleteRememberAccount()

                                            navigation.reset({
                                                index: 0,
                                                routes: [{name: 'Splash'}],
                                            })
                                        })
                                        .catch(err =>
                                            console.log('Logout: ', err),
                                        )
                                },
                            },
                        ],
                    )
                }
            })
        }
    }

    return (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                opacity: modalLoading ? 0.5 : 1,
            }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{width: '100%', height: '100%'}}>
                    <ModalLoading visible={modalLoading} />

                    <Toast position="bottom" bottomOffset={70} />

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
