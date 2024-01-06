import storage from '@react-native-firebase/storage'
import React, {useLayoutEffect, useState} from 'react'
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import {Avatar, Input} from 'react-native-elements'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import Toast from 'react-native-toast-message'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Ion from 'react-native-vector-icons/Ionicons'
import {useDispatch, useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    AVATAR_BORDER,
    PRIMARY_COLOR,
    REGEX_PHONE_NUMBER,
} from '../../../components/constants'
import {patchAPI} from '../../../components/utils/base_API'
import {updateAvatar, updateGender, updatePhoneNumber} from '../userSlice'

const ChangeInfoScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber)
    const [modalGenderVisible, setModalGenderVisible] = useState(false)
    const [modalAvatarVisible, setModalAvatarVisible] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)

    const {street, ward, district, city} = currentUser.address || ''

    const updatePhone = () => {
        setModalLoading(true)

        patchAPI({
            url: 'user/changephone',
            data: {
                phoneNumber: phoneNumber,
            },
        })
            .then(res => {
                if (res.status === 200) {
                    setModalLoading(false)

                    const action = updatePhoneNumber(res.data.newPhoneNumber)
                    dispatch(action)

                    Toast.show({
                        type: 'success',
                        text1: 'Your phone number is updated.',
                    })
                }
            })
            .catch(err => {
                setModalLoading(false)
                console.log('Update Phone: ', err)
            })
    }

    const handleChangePhoneNumberClick = () => {
        //Validate Phone Number
        if (phoneNumber == '' || !REGEX_PHONE_NUMBER.test(phoneNumber)) {
            return Alert.alert('Phone number is invalid.')
        } else {
            updatePhone()
        }
    }

    const changeGender = gender => {
        //Validate Gender
        if (gender != '') {
            setModalLoading(true)

            patchAPI({
                url: 'user/changegender',
                data: {
                    gender: gender,
                },
            }).then(res => {
                if (res.status === 200) {
                    setModalLoading(false)

                    const action = updateGender(res.data.newGender)
                    dispatch(action)

                    Toast.show({
                        type: 'success',
                        text1: 'Your gender is updated.',
                    })
                }
            })
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'My Infomation',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    const pickImageFromGallery = async () => {
        await launchImageLibrary(
            {
                mediaType: 'photo',
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
            },
            res => {
                if (res.didCancel != true) {
                    setModalLoading(true)
                    uploadImageToFirebase(
                        `users/${currentUser.email}/avatar/${res.assets[0].fileName}`,
                        res.assets[0].uri,
                    )
                }
            },
        )
    }

    const pickImageFromCamera = async () => {
        await launchCamera(
            {
                mediaType: 'photo',
            },
            res => {
                if (res.didCancel != true) {
                    setModalLoading(true)
                    uploadImageToFirebase(
                        `users/${currentUser.email}/avatar/${res.assets[0].fileName}`,
                        res.assets[0].uri,
                    )
                }
            },
        )
    }

    const uploadImageToFirebase = async (filePath, uri) => {
        try {
            //Upload Image
            await storage()
                .ref(filePath)
                .putFile(uri)
                .then(async () => {
                    //Get URL
                    await storage()
                        .ref(filePath)
                        .getDownloadURL()
                        .then(url => {
                            patchAPI({
                                url: 'user/changeavatar',
                                data: {
                                    avatarLink: url,
                                },
                            })
                                .then(res => {
                                    if (res.status === 200) {
                                        setModalLoading(false)

                                        dispatch(
                                            updateAvatar(
                                                res.data.newAvatarLink,
                                            ),
                                        )

                                        Toast.show({
                                            type: 'success',
                                            text1: 'Your avatar is updated.',
                                        })
                                    }
                                })
                                .catch(err =>
                                    console.log('Update Avatar: ', err),
                                )
                        })
                })
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                opacity:
                    modalAvatarVisible + modalGenderVisible + modalLoading
                        ? 0.5
                        : 1,
            }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    style={{
                        width: '100%',
                        height: '100%',
                    }}>
                    <ModalLoading visible={modalLoading} />

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalAvatarVisible}>
                        <SafeAreaView
                            style={{
                                flex: 1,
                            }}>
                            <View style={styles.modalView}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <Text
                                        style={{
                                            ...styles.labelStyle,
                                            fontSize: 18,
                                            marginLeft: -10,
                                        }}>
                                        Choose your image from?
                                    </Text>

                                    <View style={{flex: 1}} />

                                    <TouchableOpacity
                                        onPress={() =>
                                            setModalAvatarVisible(false)
                                        }>
                                        <Ion
                                            name="close-circle-outline"
                                            size={30}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        setModalAvatarVisible(false)
                                        pickImageFromGallery()
                                    }}
                                    style={styles.touchModalView}>
                                    <Text
                                        style={{
                                            ...styles.labelStyle,
                                            fontSize: 18,
                                        }}>
                                        Gallery
                                    </Text>

                                    <Ion
                                        name="images-outline"
                                        size={64}
                                        color={PRIMARY_COLOR}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setModalAvatarVisible(false)
                                        pickImageFromCamera()
                                    }}
                                    style={{
                                        ...styles.touchModalView,
                                        marginTop: 10,
                                    }}>
                                    <Text
                                        style={{
                                            ...styles.labelStyle,
                                            fontSize: 18,
                                        }}>
                                        Camera
                                    </Text>

                                    <Ion
                                        name="camera-outline"
                                        size={64}
                                        color={PRIMARY_COLOR}
                                    />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Modal>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                            justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                            onPress={() => setModalAvatarVisible(true)}>
                            <Avatar
                                rounded
                                source={{
                                    uri: currentUser.avatar,
                                }}
                                size={80}
                                avatarStyle={{
                                    borderWidth: 1,
                                    borderColor: AVATAR_BORDER,
                                }}
                            />

                            <Icon
                                name="camera"
                                size={20}
                                color="black"
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 5,
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
                                inputContainerStyle={styles.inputContainer}
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
                            inputContainerStyle={styles.inputContainer}
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
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: 20,
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
                                currentUser.address?.city == ''
                                    ? ''
                                    : `${street},\n${ward},\n${district},\n${city}.`
                            }
                            label="Address"
                            labelStyle={styles.labelStyle}
                            inputContainerStyle={styles.inputContainer}
                            multiline={true}
                            renderErrorMessage={false}
                            editable={false}
                            rightIcon={
                                <Icon name="pen" size={20} color="black" />
                            }
                        />
                    </TouchableOpacity>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalGenderVisible}>
                        <SafeAreaView
                            style={{
                                flex: 1,
                            }}>
                            <View style={styles.modalView}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text
                                        style={{
                                            ...styles.labelStyle,
                                            fontSize: 18,
                                            marginLeft: -10,
                                        }}>
                                        Choose your gender.
                                    </Text>

                                    <View style={{flex: 1}} />

                                    <TouchableOpacity
                                        onPress={() =>
                                            setModalGenderVisible(false)
                                        }>
                                        <Ion
                                            name="close-circle-outline"
                                            size={30}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        changeGender('Male')
                                        setModalGenderVisible(false)
                                    }}
                                    style={{
                                        ...styles.touchModalView,
                                        flexDirection: 'row',
                                    }}>
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
                                        changeGender('Female')
                                        setModalGenderVisible(false)
                                    }}
                                    style={{
                                        ...styles.touchModalView,
                                        flexDirection: 'row',
                                    }}>
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
                        </SafeAreaView>
                    </Modal>

                    <TouchableOpacity
                        onPress={() => {
                            setModalGenderVisible(true)
                            updateGender()
                        }}>
                        <Input
                            containerStyle={styles.textContainer}
                            label="Gender"
                            defaultValue={currentUser.gender}
                            labelStyle={styles.labelStyle}
                            inputContainerStyle={styles.inputContainer}
                            renderErrorMessage={false}
                            editable={false}
                            rightIcon={
                                <Icon name="pen" size={20} color="black" />
                            }
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            currentUser.fromGoogle
                                ? Alert.alert(
                                      'Cannot change password',
                                      'Because you are signing in with Google account.',
                                  )
                                : navigation.navigate('ChangePassword')
                        }}>
                        <Input
                            containerStyle={styles.textContainer}
                            label="Change Password"
                            labelStyle={styles.labelStyle}
                            defaultValue={'********'}
                            inputContainerStyle={styles.inputContainer}
                            renderErrorMessage={false}
                            editable={false}
                            rightIcon={
                                <Icon name="pen" size={20} color="black" />
                            }
                        />
                    </TouchableOpacity>

                    <Toast position="bottom" bottomOffset={70} />
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

    inputContainer: {
        ...globalStyles.input,
        width: '100%',
        marginTop: 0,
        borderBottomWidth: 0,
        paddingVertical: 5,
    },
    textContainer: {
        marginTop: 10,
        paddingHorizontal: 0,
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
        alignItems: 'center',
    },
})
