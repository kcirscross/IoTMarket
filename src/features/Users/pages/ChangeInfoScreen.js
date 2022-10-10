import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, {useLayoutEffect, useState} from 'react'
import {useEffect} from 'react'
import {Alert} from 'react-native'
import {Text} from 'react-native'
import {Modal} from 'react-native'
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
    SECONDARY_COLOR,
} from '../../../components/constants'
import {updatePhoneNumber, updateGender} from '../userSlice'

const ChangeInfoScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber)
    const [modalVisible, setModalVisible] = useState(false)

    console.log(currentUser)

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

    const changeGender = async gender => {
        //Validate Gender
        if (gender != '') {
            try {
                const token = await AsyncStorage.getItem('token')
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/changegender`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    data: {
                        gender: gender,
                    },
                }).then(res => {
                    if (res.status == 200) {
                        const action = updateGender(res.data.newGender)
                        dispatch(action)

                        Alert.alert('Update successfully.')
                    }
                })
            } catch (error) {
                console.log('Error: ', error.message)
            }
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
        <SafeAreaView
            style={{
                ...globalStyles.container,
                opacity: modalVisible ? 0.5 : 1,
            }}>
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
                                containerStyle={styles.textContainer}
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

                    <View>
                        <Input
                            placeholder="Phone Number"
                            containerStyle={styles.textContainer}
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

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(
                                'ChangeAddress',
                                currentUser.address,
                            )
                        }>
                        <Input
                            containerStyle={styles.textContainer}
                            defaultValue={
                                currentUser.address.city === ''
                                    ? ''
                                    : `${currentUser.address.street},\n${currentUser.address.ward},\n${currentUser.address.district},\n${currentUser.address.city}.`
                            }
                            label="Address"
                            labelStyle={styles.labelStyle}
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                            }}
                            multiline={true}
                            renderErrorMessage={false}
                            editable={false}
                            rightIcon={
                                <Icon name="pen" size={20} color="black" />
                            }
                        />
                    </TouchableOpacity>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}>
                        <View style={styles.modalView}>
                            <Text
                                style={{
                                    ...styles.labelStyle,
                                    fontSize: 18,
                                    marginLeft: -10,
                                }}>
                                Choose your gender.
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false)
                                    changeGender('Male')
                                }}
                                style={styles.touchModalView}>
                                {currentUser.gender == 'Male' ? (
                                    <Icon
                                        name="check-square"
                                        size={20}
                                        color="black"
                                    />
                                ) : (
                                    <Icon
                                        name="square"
                                        size={20}
                                        color="black"
                                    />
                                )}

                                <Text
                                    style={{
                                        ...styles.labelStyle,
                                        marginLeft: 10,
                                        fontSize: 16,
                                    }}>
                                    Male
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false)
                                    changeGender('Female')
                                }}
                                style={styles.touchModalView}>
                                {currentUser.gender == 'Female' ? (
                                    <Icon
                                        name="check-square"
                                        size={20}
                                        color="black"
                                    />
                                ) : (
                                    <Icon
                                        name="square"
                                        size={20}
                                        color="black"
                                    />
                                )}
                                <Text
                                    style={{
                                        ...styles.labelStyle,
                                        marginLeft: 10,
                                        fontSize: 16,
                                    }}>
                                    Female
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    <TouchableOpacity
                        onPress={() => {
                            setModalVisible(true)
                            updateGender()
                        }}>
                        <Input
                            containerStyle={styles.textContainer}
                            label="Gender"
                            defaultValue={currentUser.gender}
                            labelStyle={styles.labelStyle}
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                            }}
                            renderErrorMessage={false}
                            editable={false}
                            rightIcon={
                                <Icon name="pen" size={20} color="black" />
                            }
                        />
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Input
                            containerStyle={styles.textContainer}
                            label="Change Password"
                            labelStyle={styles.labelStyle}
                            defaultValue={'********'}
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                            }}
                            multiline={true}
                            renderErrorMessage={false}
                            editable={false}
                            rightIcon={
                                <Icon name="pen" size={20} color="black" />
                            }
                        />
                    </TouchableOpacity>
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

    textContainer: {
        ...globalStyles.input,
        width: '100%',
    },
    modalView: {
        backgroundColor: 'white',
        position: 'absolute',
        justifyContent: 'center',
        bottom: 0,
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    touchModalView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
