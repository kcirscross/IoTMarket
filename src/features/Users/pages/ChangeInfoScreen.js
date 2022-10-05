import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, {useLayoutEffect, useState} from 'react'
import {useEffect} from 'react'
import {Alert} from 'react-native'
import {Text} from 'react-native'
import {
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import {Avatar, Input} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useSelector, useDispatch} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    API_URL,
    PRIMARY_COLOR,
    REGEX_PHONE_NUMBER,
} from '../../../components/constants'
import {updatePhoneNumber} from '../userSlice'

const ChangeInfoScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber)

    const updatePhone = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            axios({
                method: 'patch',
                url: `${API_URL}/user/changephone`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
                data: {
                    phoneNumber: phoneNumber,
                },
            }).then(res => {
                if (res.status == 200) {
                    const action = updatePhoneNumber(res.data.newPhoneNumber)
                    dispatch(action)
                }
            })
        } catch (error) {
            console.log('Error when get token.', error.message)
        }
    }

    const handleChangePhoneNumberClick = () => {
        //Validate Phone Number
        if (phoneNumber == '' || !REGEX_PHONE_NUMBER.test(phoneNumber)) {
            return Alert.alert('Phone number is invalid.')
        } else {
            updatePhone()
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

    return (
        <SafeAreaView style={globalStyles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                        }}>
                        <TouchableOpacity>
                            <Avatar
                                rounded
                                source={{
                                    uri: 'https://firebasestorage.googleapis.com/v0/b/iotmarket-10501.appspot.com/o/logo.jpg?alt=media&token=ed49f7ba-f12d-469f-9467-974ddbdbaf74',
                                }}
                                size={64}
                            />
                            <Icon
                                name="camera"
                                size={20}
                                color="black"
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                }}
                            />
                        </TouchableOpacity>

                        <View
                            style={{
                                marginLeft: 10,
                                flex: 1,
                            }}>
                            <Input
                                placeholder="Full Name"
                                containerStyle={globalStyles.input}
                                defaultValue={currentUser.fullName}
                                label="Full Name"
                                labelStyle={styles.labelStyle}
                                inputContainerStyle={{
                                    borderBottomWidth: 0,
                                }}
                                renderErrorMessage={false}
                                editable={false}
                            />
                        </View>
                    </View>

                    <View
                        style={{
                            marginLeft: 10,
                            width: '100%',
                        }}>
                        <Input
                            placeholder="Phone Number"
                            containerStyle={globalStyles.input}
                            defaultValue={currentUser.phoneNumber}
                            label="Phone Number"
                            labelStyle={styles.labelStyle}
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                            }}
                            keyboardType={'phone-pad'}
                            renderErrorMessage={
                                !REGEX_PHONE_NUMBER.test(phoneNumber)
                            }
                            errorMessage="This field must filled in and have valid phone number."
                            errorStyle={{
                                display: !REGEX_PHONE_NUMBER.test(phoneNumber)
                                    ? 'flex'
                                    : 'none',
                            }}
                            onChangeText={text => setPhoneNumber(text)}
                            rightIcon={
                                phoneNumber === currentUser.phoneNumber ? (
                                    <Icon name="pen" size={20} color="black" />
                                ) : (
                                    <TouchableOpacity
                                        onPress={handleChangePhoneNumberClick}
                                        style={{
                                            ...globalStyles.button,
                                            width: 60,
                                            height: 35,
                                        }}>
                                        <Text style={styles.textButton}>
                                            SAVE
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                        />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default ChangeInfoScreen

const styles = StyleSheet.create({
    labelStyle: {
        color: 'black',
        fontWeight: 'normal',
    },

    textButton: {
        color: 'white',
        fontSize: 16,
    },
})
