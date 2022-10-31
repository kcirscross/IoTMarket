import storage from '@react-native-firebase/storage'
import axios from 'axios'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
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
import DropDownPicker from 'react-native-dropdown-picker'
import {Avatar, Input} from 'react-native-elements'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import Toast from 'react-native-toast-message'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'

const UpdateStoreScreen = ({navigation, route}) => {
    const storeInfo = route.params
    const currentUser = useSelector(state => state.user)

    const [openCity, setOpenCity] = useState(false)
    const [valueCity, setValueCity] = useState(null)
    const [itemsCity, setItemsCity] = useState([])

    const [openDistrict, setOpenDistrict] = useState(false)
    const [valueDistrict, setValueDistrict] = useState(null)
    const [itemsDistrict, setItemsDistrict] = useState([])

    const [openWard, setOpenWard] = useState(false)
    const [valueWard, setValueWard] = useState(null)
    const [itemsWard, setItemsWard] = useState([])

    const [chosenCity, setChosenCity] = useState(storeInfo.address.city)
    const [chosenDistrict, setChosenDistrict] = useState(
        storeInfo.address.district,
    )
    const [chosenWard, setChosenWard] = useState(storeInfo.address.ward)
    const [chosenStreet, setChosenStreet] = useState(storeInfo.address.street)

    const [modalLoading, setModalLoading] = useState(false)

    const [displayName, setDisplayName] = useState(storeInfo.displayName)
    const [description, setDescription] = useState(storeInfo.description)
    const [shopImage, setShopImage] = useState('')
    const [modalAvatarVisible, setModalAvatarVisible] = useState(false)
    const [filePath, setFilePath] = useState('')

    const getCity = async () => {
        let list = []
        await axios({
            method: 'get',
            url: 'https://provinces.open-api.vn/api/p/',
        })
            .then(res => {
                if (res.status == 200) {
                    res.data.forEach(city =>
                        list.push({
                            label: city.name,
                            value: city.code,
                        }),
                    )
                    setItemsCity(list)
                }
            })
            .catch(err => console.log(err))
    }

    const getDistrict = async code => {
        let list = []
        await axios({
            method: 'get',
            url: `https://provinces.open-api.vn/api/p/${code}`,
            params: {
                depth: 2,
            },
        })
            .then(res => {
                if (res.status == 200) {
                    res.data.districts.forEach(districts =>
                        list.push({
                            label: districts.name,
                            value: districts.code,
                        }),
                    )
                    setItemsDistrict(list)
                }
            })
            .catch(err => console.log(err))
    }

    const getWard = async code => {
        let list = []
        await axios({
            method: 'get',
            url: `https://provinces.open-api.vn/api/d/${code}`,
            params: {
                depth: 2,
            },
        })
            .then(res => {
                if (res.status == 200) {
                    res.data.wards.forEach(wards =>
                        list.push({
                            label: wards.name,
                            value: wards.code,
                        }),
                    )
                    setItemsWard(list)
                }
            })
            .catch(err => console.log(err))
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Update Store',
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
                    setShopImage(res.assets[0].uri)
                    setFilePath(
                        `users/${currentUser.email}/shopImage/${res.assets[0].fileName}`,
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
                    setShopImage(res.assets[0].uri)
                    setFilePath(
                        `users/${currentUser.email}/shopImage/${res.assets[0].fileName}`,
                    )
                }
            },
        )
    }

    useEffect(() => {
        getCity()
    }, [])

    const updateStore = image => {
        axios({
            method: 'patch',
            url: `${API_URL}/store`,
            headers: {
                authorization: `Bearer ${currentUser.deviceToken}`,
            },
            data: {
                displayName: displayName,
                description: description,
                shopImage: image,
                address: {
                    street: chosenStreet,
                    district: chosenDistrict,
                    ward: chosenWard,
                    city: chosenCity,
                },
            },
        })
            .then(res => {
                setModalLoading(false)
                Toast.show({
                    type: 'success',
                    text1: 'Your store is updated.',
                })
            })
            .catch(error => {
                console.log(error.response.data)
                setModalLoading(false)
            })
    }

    const handleUpdateStore = async () => {
        try {
            if (
                displayName == '' ||
                displayName.length < 15 ||
                description == '' ||
                description.length < 15 ||
                chosenStreet == ''
            ) {
                Toast.show({
                    type: 'error',
                    text1: 'Please fill in all field.',
                })
            } else {
                if (filePath == '') {
                    setModalLoading(true)

                    updateStore(storeInfo.shopImage)
                } else {
                    setModalLoading(true)

                    await storage()
                        .ref(filePath)
                        .putFile(shopImage)
                        .then(async () => {
                            await storage()
                                .ref(filePath)
                                .getDownloadURL()
                                .then(url => {
                                    updateStore(url)
                                })
                        })
                }
            }
        } catch (error) {
            setModalLoading(false)
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior="height"
                    style={{
                        height: '100%',
                        width: '100%',
                    }}>
                    <ModalLoading visible={modalLoading} />
                    <Toast position="bottom" bottomOffset={70} />
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalAvatarVisible}>
                        <SafeAreaView
                            // onTouchStart={() => setModalAvatarVisible(false)}
                            style={{
                                flex: 1,
                            }}>
                            <View style={styles.modalView}>
                                <Text
                                    style={{
                                        ...styles.labelStyle,
                                        fontSize: 18,
                                        marginLeft: -10,
                                    }}>
                                    Choose your image from?
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalAvatarVisible(false)
                                        pickImageFromGallery()
                                    }}
                                    style={styles.touchModalView}>
                                    <Text
                                        style={{
                                            ...styles.labelStyle,
                                            marginLeft: 10,
                                            fontSize: 16,
                                        }}>
                                        Gallery
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalAvatarVisible(false)
                                        pickImageFromCamera()
                                    }}
                                    style={styles.touchModalView}>
                                    <Text
                                        style={{
                                            ...styles.labelStyle,
                                            marginLeft: 10,
                                            fontSize: 16,
                                        }}>
                                        Camera
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Modal>
                    <Text style={{...styles.labelStyle, fontSize: 20}}>
                        Store Logo
                    </Text>

                    <TouchableOpacity
                        onPress={() => setModalAvatarVisible(true)}
                        style={{
                            alignItems: 'center',
                        }}>
                        <Avatar
                            rounded
                            size={90}
                            source={
                                shopImage == ''
                                    ? {uri: storeInfo.shopImage}
                                    : {uri: shopImage}
                            }
                            avatarStyle={{
                                borderColor: 'black',
                                borderWidth: 1,
                            }}
                        />

                        <Icon
                            name="camera"
                            size={24}
                            color="black"
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: '38%',
                            }}
                        />
                    </TouchableOpacity>

                    <Input
                        placeholder="Store Name"
                        containerStyle={styles.textContainer}
                        defaultValue={storeInfo.displayName}
                        label="Store Name (At least 15 characters)"
                        labelStyle={styles.labelStyle}
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                        }}
                        renderErrorMessage={false}
                        onChangeText={text => setDisplayName(text)}
                    />

                    <Input
                        placeholder="Store Description"
                        multiline
                        containerStyle={styles.textContainer}
                        defaultValue={storeInfo.description}
                        label="Store Description (At least 15 character)"
                        labelStyle={styles.labelStyle}
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                        }}
                        renderErrorMessage={false}
                        onChangeText={text => setDescription(text)}
                    />

                    <Input
                        placeholder="Detail Address"
                        containerStyle={styles.textContainer}
                        defaultValue={storeInfo.address.street}
                        label="Detail Address"
                        labelStyle={styles.labelStyle}
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                        }}
                        renderErrorMessage={false}
                        onChangeText={text => setChosenStreet(text)}
                    />

                    <View
                        style={{
                            marginTop: 10,
                        }}>
                        <Text style={styles.labelStyle}>Choose your city.</Text>
                        <DropDownPicker
                            open={openCity}
                            value={valueCity}
                            items={itemsCity}
                            placeholder={storeInfo.address.city}
                            labelStyle={{
                                color: 'black',
                            }}
                            setOpen={setOpenCity}
                            setValue={setValueCity}
                            setItems={setItemsCity}
                            onSelectItem={item => {
                                getDistrict(item.value)
                                setChosenCity(item.label)
                            }}
                            style={{marginTop: 5}}
                            zIndex={3}
                        />
                    </View>

                    <View
                        style={{
                            marginTop: 10,
                        }}>
                        <Text style={styles.labelStyle}>
                            Choose your district.
                        </Text>
                        <DropDownPicker
                            open={openDistrict}
                            value={valueDistrict}
                            items={itemsDistrict}
                            placeholder={storeInfo.address.district}
                            labelStyle={{
                                color: 'black',
                            }}
                            setOpen={setOpenDistrict}
                            setValue={setValueDistrict}
                            setItems={setItemsDistrict}
                            onSelectItem={item => {
                                getWard(item.value)
                                setChosenDistrict(item.label)
                            }}
                            style={{marginTop: 5}}
                            zIndex={2}
                        />
                    </View>

                    <View
                        style={{
                            marginTop: 10,
                        }}>
                        <Text style={styles.labelStyle}>Choose your ward.</Text>
                        <DropDownPicker
                            open={openWard}
                            value={valueWard}
                            items={itemsWard}
                            labelStyle={{
                                color: 'black',
                            }}
                            placeholder={storeInfo.address.ward}
                            setOpen={setOpenWard}
                            setValue={setValueWard}
                            setItems={setItemsWard}
                            style={{marginTop: 5}}
                            zIndex={1}
                            onSelectItem={item => setChosenWard(item.label)}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => handleUpdateStore(shopImage)}
                        style={{
                            ...globalStyles.button,
                            position: 'absolute',
                            bottom: 10,
                            alignSelf: 'center',
                        }}>
                        <Text style={globalStyles.textButton}>
                            Update Store
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default UpdateStoreScreen

const styles = StyleSheet.create({
    labelStyle: {
        color: 'black',
        fontWeight: 'normal',
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
