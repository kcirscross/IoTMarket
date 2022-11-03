import AsyncStorage from '@react-native-async-storage/async-storage'
import storage from '@react-native-firebase/storage'
import {useIsFocused} from '@react-navigation/native'
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
import {Avatar, Card, Input} from 'react-native-elements'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import Toast from 'react-native-toast-message'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Ion from 'react-native-vector-icons/Ionicons'
import {useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    API_URL,
    AVATAR_BORDER,
    PRIMARY_COLOR,
} from '../../../components/constants'
import {getAPI} from '../../../components/utils/base_API'

const StoreScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)
    const isFocus = useIsFocused()

    const [openCity, setOpenCity] = useState(false)
    const [valueCity, setValueCity] = useState(null)
    const [itemsCity, setItemsCity] = useState([])

    const [openDistrict, setOpenDistrict] = useState(false)
    const [valueDistrict, setValueDistrict] = useState(null)
    const [itemsDistrict, setItemsDistrict] = useState([])

    const [openWard, setOpenWard] = useState(false)
    const [valueWard, setValueWard] = useState(null)
    const [itemsWard, setItemsWard] = useState([])

    const [chosenCity, setChosenCity] = useState('')
    const [chosenDistrict, setChosenDistrict] = useState('')
    const [chosenWard, setChosenWard] = useState('')
    const [chosenStreet, setChosenStreet] = useState('')

    const [modalLoading, setModalLoading] = useState(false)

    const [displayName, setDisplayName] = useState('')
    const [description, setDescription] = useState('')
    const [shopImage, setShopImage] = useState('')
    const [modalAvatarVisible, setModalAvatarVisible] = useState(false)
    const [filePath, setFilePath] = useState('')

    const [storeInfo, setStoreInfo] = useState([])
    const [followers, setFollowers] = useState(0)

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
            title: 'My Store',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
            headerRight: () =>
                currentUser.storeId != undefined && (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SettingStore')}
                            style={{
                                marginRight: 5,
                            }}>
                            <Icon name="cog" size={24} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                        // onPress={() => navigation.navigate('Cart')}
                        >
                            <Ion
                                name="notifications-outline"
                                size={26}
                                color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Chats')}>
                            <Ion
                                name="chatbubble-ellipses-outline"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                ),
        })
    }, [])

    useEffect(() => {
        getCity()
    }, [])

    const handleCreateStoreClick = async uri => {
        //Validate
        if (
            displayName == '' ||
            displayName.length < 15 ||
            description == '' ||
            description.length < 15 ||
            chosenStreet == '' ||
            shopImage == '' ||
            chosenCity == '' ||
            chosenDistrict == '' ||
            chosenWard == ''
        ) {
            Toast.show({
                type: 'error',
                text1: 'Please fill in all field.',
            })
        } else {
            try {
                setModalLoading(true)

                //Upload Image
                await storage()
                    .ref(filePath)
                    .putFile(uri)
                    .then(async () => {
                        //Get URL
                        await storage()
                            .ref(filePath)
                            .getDownloadURL()
                            .then(async url => {
                                try {
                                    await AsyncStorage.getItem('token').then(
                                        async token => {
                                            await axios({
                                                method: 'post',
                                                url: `${API_URL}/user/storerequest`,
                                                headers: {
                                                    authorization: `Bearer ${token}`,
                                                },
                                                data: {
                                                    displayName: displayName,
                                                    description: description,
                                                    shopImage: url.toString(),
                                                    address: {
                                                        street: chosenStreet,
                                                        district:
                                                            chosenDistrict,
                                                        ward: chosenWard,
                                                        city: chosenCity,
                                                    },
                                                },
                                            })
                                                .then(res => {
                                                    if (res.status == 200) {
                                                        setModalLoading(false)
                                                        Toast.show({
                                                            type: 'success',
                                                            text1: 'Please wait Admin approve your request.',
                                                        })
                                                    }
                                                })
                                                .catch(err => {
                                                    setModalLoading(false)
                                                    console.log(
                                                        err.response.data,
                                                    )
                                                    if (
                                                        err.response.data
                                                            .message ==
                                                        'This user already sent request and currently waiting for approval'
                                                    ) {
                                                        Toast.show({
                                                            type: 'error',
                                                            text1: 'This user already sent request.',
                                                        })
                                                    }
                                                })
                                        },
                                    )
                                } catch (error) {
                                    setModalLoading(false)
                                    console.log(
                                        'Error Upload Image ',
                                        error.message,
                                    )
                                }
                            })
                    })
            } catch (error) {
                setModalLoading(false)
                console.log('Error Upload Image: ', error)
            }
        }
    }

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

    //Get Store Infomation if Exist
    useEffect(() => {
        if (currentUser.storeId != undefined) {
            setModalLoading(true)
            getAPI({url: `store/${currentUser.storeId}`})
                .then(res => {
                    if (res.status === 200) {
                        setStoreInfo(res.data.store)
                        setFollowers(res.data.store.followers.length)
                        setModalLoading(false)
                    }
                })
                .catch(err => {
                    setModalLoading(false)
                    console.log('Get Store: ', err)
                })
        }
    }, [isFocus])

    return !modalLoading ? (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                opacity: modalLoading ? 0.5 : 1,
            }}>
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

                    {currentUser.storeId == undefined ? (
                        <View style={{flex: 1}}>
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
                                            ? require('~/assets/images/logo.jpg')
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
                                containerStyle={styles.textContainer}
                                label="Store Description (At least 15 character)"
                                labelStyle={styles.labelStyle}
                                inputContainerStyle={{
                                    borderBottomWidth: 0,
                                }}
                                renderErrorMessage={false}
                                onChangeText={text => setDescription(text)}
                            />

                            <View>
                                <Input
                                    placeholder="Detail Address"
                                    containerStyle={styles.textContainer}
                                    label="Detail Address"
                                    labelStyle={styles.labelStyle}
                                    inputContainerStyle={{
                                        borderBottomWidth: 0,
                                    }}
                                    renderErrorMessage={false}
                                    onChangeText={text => setChosenStreet(text)}
                                />
                            </View>

                            <View
                                style={{
                                    marginTop: 10,
                                }}>
                                <Text style={styles.labelStyle}>
                                    Choose your city.
                                </Text>
                                <DropDownPicker
                                    open={openCity}
                                    value={valueCity}
                                    items={itemsCity}
                                    placeholder={'Select your city.'}
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
                                    placeholder={'Select your district.'}
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
                                <Text style={styles.labelStyle}>
                                    Choose your ward.
                                </Text>
                                <DropDownPicker
                                    open={openWard}
                                    value={valueWard}
                                    items={itemsWard}
                                    labelStyle={{
                                        color: 'black',
                                    }}
                                    placeholder={'Select your ward.'}
                                    setOpen={setOpenWard}
                                    setValue={setValueWard}
                                    setItems={setItemsWard}
                                    style={{marginTop: 5}}
                                    zIndex={1}
                                    onSelectItem={item =>
                                        setChosenWard(item.label)
                                    }
                                />
                            </View>

                            <TouchableOpacity
                                onPress={() =>
                                    handleCreateStoreClick(shopImage)
                                }
                                style={{
                                    ...globalStyles.button,
                                    position: 'absolute',
                                    bottom: 10,
                                    alignSelf: 'center',
                                }}>
                                <Text style={globalStyles.textButton}>
                                    Create Store
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Card
                            containerStyle={{
                                ...globalStyles.cardContainer,
                                marginTop: 10,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <Avatar
                                    rounded
                                    size={65}
                                    source={
                                        storeInfo.shopImage == ''
                                            ? require('~/assets/images/logo.jpg')
                                            : {uri: storeInfo.shopImage}
                                    }
                                    avatarStyle={{
                                        borderColor: AVATAR_BORDER,
                                        borderWidth: 1,
                                    }}
                                />

                                <View style={{marginLeft: 10, flex: 1}}>
                                    <Text
                                        style={{
                                            ...styles.labelStyle,
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                        }}>
                                        {storeInfo.displayName}
                                    </Text>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 5,
                                        }}>
                                        <Text style={{color: 'black'}}>
                                            {followers} Follow
                                        </Text>

                                        <View style={{flex: 1}} />

                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate('Profile', {
                                                    0:
                                                        currentUser.storeId !=
                                                        undefined
                                                            ? currentUser.storeId
                                                            : currentUser._id,
                                                })
                                            }
                                            style={{
                                                borderWidth: 1,
                                                borderColor: PRIMARY_COLOR,
                                                padding: 5,
                                                borderRadius: 10,
                                            }}>
                                            <Text
                                                style={{
                                                    ...styles.labelStyle,
                                                    color: PRIMARY_COLOR,
                                                }}>
                                                See My Store
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    )}
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    ) : (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                opacity: modalLoading ? 0.5 : 1,
            }}>
            <ModalLoading visible={modalLoading} />
        </SafeAreaView>
    )
}

export default StoreScreen

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
