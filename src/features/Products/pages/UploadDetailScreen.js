import AsyncStorage from '@react-native-async-storage/async-storage'
import firebase from '@react-native-firebase/app'
import axios from 'axios'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import {Input} from 'react-native-elements'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import Toast from 'react-native-toast-message'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import UploadImageItem from '../components/UploadImageItem'

const UploadDetailScreen = ({navigation, route}) => {
    const currentUser = useSelector(state => state.user)
    const [listImages, setListImages] = useState([])
    const [modalLoading, setModalLoading] = useState(false)
    const [modalPhotos, setModalPhotos] = useState(false)

    const [productName, setProductName] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productAmount, setProductAmount] = useState('')
    const [heightBeforeBoxed, setHeightBeforeBoxed] = useState('')
    const [weightBeforeBoxed, setWeightBeforeBoxed] = useState('')
    const [widthBeforeBoxed, setWidthBeforeBoxed] = useState('')
    const [lengthBeforeBoxed, setLengthBeforeBoxed] = useState('')
    const [heightAfterBoxed, setHeightAfterBoxed] = useState('')
    const [weightAfterBoxed, setWeightAfterBoxed] = useState('')
    const [widthAfterBoxed, setWidthAfterBoxed] = useState('')
    const [lengthAfterBoxed, setLengthAfterBoxed] = useState('')

    const [openCondition, setOpenCondition] = useState(false)
    const [valueCondition, setValueCondition] = useState(null)
    const [itemsCondition, setItemsCondition] = useState([
        {
            label: 'New',
            value: 'New',
        },
        {
            label: 'Used - Like New',
            value: 'Used - Like New',
        },
        {
            label: 'Used - Good',
            value: 'Used - Good',
        },
        {
            label: 'Used - Fair',
            value: 'Used - Fair',
        },
    ])
    const [chosenCondition, setChosenCondition] = useState('')

    const [listSubCategory, setListSubCategory] = useState([])
    const [openSubCategory, setOpenSubCategory] = useState(false)
    const [valueSubCategory, setValueSubCategory] = useState(null)
    const [chosenSubCategory, setChosenSubCategory] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.categoryName,
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    //Loading SubCategory
    useEffect(() => {
        let listSub = []
        axios({
            method: 'get',
            url: `${API_URL}/subcategory/${route.params._id}`,
        })
            .then(res => {
                if (res.status == 200) {
                    res.data.subcategories.forEach(sub =>
                        listSub.push({
                            label: sub.subcategoryName,
                            value: sub._id,
                        }),
                    )
                    setListSubCategory(listSub)
                }
            })
            .catch(error => console.log('SubCategory: ', error))
    }, [])

    let getData = childData => {
        const new_arr = listImages.filter(item => item !== childData)
        setListImages(new_arr)
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
                    setListImages([...listImages, res.assets[0].uri])
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
                    setListImages([...listImages, res.assets[0].uri])
                }
            },
        )
    }

    const uploadProduct = async () => {
        setModalLoading(true)
        const filePath = `products/${
            currentUser.email + '_' + productName + '_' + Date.now()
        }/images`
        const token = await AsyncStorage.getItem('token')
        let list = []

        try {
            listImages.map((item, index) => {
                //Upload Images
                firebase
                    .storage()
                    .ref(
                        `${filePath}/${listImages[index].substring(
                            listImages[index].lastIndexOf('/') + 1,
                        )}`,
                    )
                    .putFile(item)
                    .then(async () => {
                        //Get Download Url
                        const result = await firebase
                            .storage()
                            .ref(
                                `${filePath}/${listImages[index].substring(
                                    listImages[index].lastIndexOf('/') + 1,
                                )}`,
                            )
                            .getDownloadURL()
                        list.push(result)

                        if (index == listImages.length - 1) {
                            axios({
                                method: 'post',
                                url: `${API_URL}/product`,
                                headers: {
                                    authorization: `Bearer ${token}`,
                                },
                                data: {
                                    thumbnailImage: list[0],
                                    productName: productName,
                                    subcategoryId: chosenSubCategory,
                                    description: productDescription,
                                    categoryId: route.params._id,
                                    detailImages: list,
                                    video: '',
                                    weight: parseFloat(weightBeforeBoxed),
                                    height: parseFloat(heightBeforeBoxed),
                                    width: parseFloat(widthBeforeBoxed),
                                    length: parseFloat(lengthBeforeBoxed),
                                    weightAfterBoxing:
                                        parseFloat(weightAfterBoxed),
                                    heightAfterBoxing:
                                        parseFloat(heightAfterBoxed),
                                    widthAfterBoxing:
                                        parseFloat(widthAfterBoxed),
                                    lengthAfterBoxing:
                                        parseFloat(lengthAfterBoxed),
                                    price: productPrice,
                                    numberInStock: parseFloat(productAmount),
                                    condition: chosenCondition,
                                },
                            })
                                .then(res => {
                                    if (res.status == 200) {
                                        setModalLoading(false)
                                        Alert.alert(
                                            'Upload product successfully.',
                                            '',
                                            [
                                                {
                                                    text: 'OK',
                                                    onPress: () =>
                                                        navigation.replace(
                                                            'Profile',
                                                            currentUser,
                                                        ),
                                                },
                                            ],
                                        )
                                    }
                                })
                                .catch(err => {
                                    console.log(err)
                                    setModalLoading(false)
                                })
                        }
                    })
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleUploadClick = async () => {
        if (
            productName == '' ||
            productDescription == '' ||
            productPrice == '' ||
            productAmount == '' ||
            heightBeforeBoxed == '' ||
            weightBeforeBoxed == '' ||
            widthBeforeBoxed == '' ||
            lengthBeforeBoxed == '' ||
            heightAfterBoxed == '' ||
            weightAfterBoxed == '' ||
            widthAfterBoxed == '' ||
            lengthAfterBoxed == '' ||
            chosenCondition == ''
        ) {
            Toast.show({
                type: 'error',
                text1: 'Please fill in all field.',
            })
        } else {
            uploadProduct()
        }
    }

    return (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                opacity: modalLoading + modalPhotos ? 0.5 : 1,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        behavior="padding"
                        style={{height: '100%', width: '100%', paddingTop: 10}}>
                        <ModalLoading visible={modalLoading} />

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalPhotos}>
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
                                            setModalPhotos(false)
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
                                            setModalPhotos(false)
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

                        <View>
                            <Text
                                style={{
                                    ...styles.labelStyle,
                                    fontSize: 18,
                                }}>
                                Please choose a sub category
                            </Text>

                            <DropDownPicker
                                open={openSubCategory}
                                value={valueSubCategory}
                                items={listSubCategory}
                                setOpen={setOpenSubCategory}
                                setValue={setValueSubCategory}
                                setItems={setListSubCategory}
                                listMode={'SCROLLVIEW'}
                                placeholder="Select a sub category"
                                onSelectItem={item =>
                                    setChosenSubCategory(item.value)
                                }
                            />

                            <TouchableOpacity
                                style={{
                                    ...styles.touch,
                                    marginTop: 10,
                                }}
                                disabled={listImages.length == 5 ? true : false}
                                onPress={() => setModalPhotos(true)}>
                                <Icon name="camera" size={64} color="black" />
                                <Text style={{color: 'black'}}>
                                    Images: {`${listImages.length}/5`}
                                </Text>
                            </TouchableOpacity>

                            {listImages.length > 0 && (
                                <ScrollView
                                    horizontal
                                    style={{
                                        height: 130,
                                        paddingVertical: 5,
                                        paddingLeft: 10,
                                    }}>
                                    {listImages.map(item => (
                                        <UploadImageItem
                                            onPress={getData}
                                            key={item}
                                            imageURI={item}
                                        />
                                    ))}
                                </ScrollView>
                            )}

                            <Input
                                label="Name"
                                containerStyle={{
                                    ...globalStyles.input,
                                    marginTop: 10,
                                    width: '100%',
                                }}
                                inputContainerStyle={{
                                    borderBottomWidth: 0,
                                }}
                                inputStyle={{
                                    paddingVertical: 0,
                                    fontSize: 16,
                                    ...styles.textStyle,
                                }}
                                labelStyle={styles.labelStyle}
                                renderErrorMessage={false}
                                onChangeText={text => setProductName(text)}
                            />

                            <Input
                                label="Description"
                                multiline={true}
                                numberOfLines={10}
                                containerStyle={{
                                    ...globalStyles.input,
                                    marginTop: 5,
                                    width: '100%',
                                }}
                                inputContainerStyle={{
                                    borderBottomWidth: 0,
                                }}
                                inputStyle={{
                                    paddingVertical: 0,
                                    fontSize: 16,
                                    ...styles.textStyle,
                                    textAlignVertical: 'top',
                                }}
                                labelStyle={styles.labelStyle}
                                renderErrorMessage={false}
                                onChangeText={text =>
                                    setProductDescription(text)
                                }
                            />

                            <Input
                                label="Price (VND)"
                                keyboardType="number-pad"
                                containerStyle={{
                                    ...globalStyles.input,
                                    marginTop: 5,
                                    width: '100%',
                                }}
                                inputContainerStyle={{
                                    borderBottomWidth: 0,
                                }}
                                inputStyle={{
                                    paddingVertical: 0,
                                    fontSize: 16,
                                    ...styles.textStyle,
                                }}
                                labelStyle={styles.labelStyle}
                                renderErrorMessage={false}
                                onChangeText={text => setProductPrice(text)}
                            />

                            <Input
                                label="Number in Stock"
                                keyboardType="number-pad"
                                containerStyle={{
                                    ...globalStyles.input,
                                    marginTop: 5,
                                    width: '100%',
                                }}
                                inputContainerStyle={{
                                    borderBottomWidth: 0,
                                }}
                                inputStyle={{
                                    paddingVertical: 0,
                                    fontSize: 16,
                                    ...styles.textStyle,
                                }}
                                labelStyle={styles.labelStyle}
                                renderErrorMessage={false}
                                onChangeText={text => setProductAmount(text)}
                            />

                            <Text
                                style={{
                                    ...styles.labelStyle,
                                    fontSize: 18,
                                    marginTop: 10,
                                }}>
                                Condition of Product
                            </Text>

                            <DropDownPicker
                                open={openCondition}
                                value={valueCondition}
                                items={itemsCondition}
                                setOpen={setOpenCondition}
                                setValue={setValueCondition}
                                setItems={setItemsCondition}
                                listMode={'SCROLLVIEW'}
                                placeholder="Select a condition"
                                onSelectItem={item =>
                                    setChosenCondition(item.value)
                                }
                            />

                            <Text
                                style={{
                                    ...styles.labelStyle,
                                    fontSize: 18,
                                    marginTop: 10,
                                }}>
                                Size of Product Before Boxed
                            </Text>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}>
                                <Input
                                    label="Weight (gram)"
                                    keyboardType="number-pad"
                                    containerStyle={{
                                        ...globalStyles.input,
                                        marginTop: 5,
                                        width: '40%',
                                    }}
                                    inputContainerStyle={{
                                        borderBottomWidth: 0,
                                    }}
                                    inputStyle={{
                                        paddingVertical: 0,
                                        fontSize: 16,
                                        ...styles.textStyle,
                                    }}
                                    labelStyle={styles.labelStyle}
                                    renderErrorMessage={false}
                                    onChangeText={text =>
                                        setWeightBeforeBoxed(text)
                                    }
                                />
                                <Input
                                    label="Height  (cm)"
                                    keyboardType="number-pad"
                                    containerStyle={{
                                        ...globalStyles.input,
                                        marginTop: 5,
                                        width: '40%',
                                        marginLeft: 20,
                                    }}
                                    inputContainerStyle={{
                                        borderBottomWidth: 0,
                                    }}
                                    inputStyle={{
                                        paddingVertical: 0,
                                        fontSize: 16,
                                        ...styles.textStyle,
                                    }}
                                    labelStyle={styles.labelStyle}
                                    renderErrorMessage={false}
                                    onChangeText={text =>
                                        setHeightBeforeBoxed(text)
                                    }
                                />
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}>
                                <Input
                                    label="Width (cm)"
                                    keyboardType="number-pad"
                                    containerStyle={{
                                        ...globalStyles.input,
                                        marginTop: 5,
                                        width: '40%',
                                    }}
                                    inputContainerStyle={{
                                        borderBottomWidth: 0,
                                    }}
                                    inputStyle={{
                                        paddingVertical: 0,
                                        fontSize: 16,
                                        ...styles.textStyle,
                                    }}
                                    labelStyle={styles.labelStyle}
                                    renderErrorMessage={false}
                                    onChangeText={text =>
                                        setWidthBeforeBoxed(text)
                                    }
                                />
                                <Input
                                    label="Length  (cm)"
                                    keyboardType="number-pad"
                                    containerStyle={{
                                        ...globalStyles.input,
                                        marginTop: 5,
                                        width: '40%',
                                        marginLeft: 20,
                                    }}
                                    inputContainerStyle={{
                                        borderBottomWidth: 0,
                                    }}
                                    inputStyle={{
                                        paddingVertical: 0,
                                        fontSize: 16,
                                        ...styles.textStyle,
                                    }}
                                    labelStyle={styles.labelStyle}
                                    renderErrorMessage={false}
                                    onChangeText={text =>
                                        setLengthBeforeBoxed(text)
                                    }
                                />
                            </View>

                            <Text
                                style={{
                                    ...styles.labelStyle,
                                    fontSize: 18,
                                    marginTop: 10,
                                }}>
                                Size of Product After Boxed
                            </Text>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}>
                                <Input
                                    label="Weight  (gram)"
                                    keyboardType="number-pad"
                                    containerStyle={{
                                        ...globalStyles.input,
                                        marginTop: 5,
                                        width: '40%',
                                    }}
                                    inputContainerStyle={{
                                        borderBottomWidth: 0,
                                    }}
                                    inputStyle={{
                                        paddingVertical: 0,
                                        fontSize: 16,
                                        ...styles.textStyle,
                                    }}
                                    labelStyle={styles.labelStyle}
                                    renderErrorMessage={false}
                                    onChangeText={text =>
                                        setWeightAfterBoxed(text)
                                    }
                                />

                                <Input
                                    label="Height  (cm)"
                                    keyboardType="number-pad"
                                    containerStyle={{
                                        ...globalStyles.input,
                                        marginTop: 5,
                                        width: '40%',
                                        marginLeft: 20,
                                    }}
                                    inputContainerStyle={{
                                        borderBottomWidth: 0,
                                    }}
                                    inputStyle={{
                                        paddingVertical: 0,
                                        fontSize: 16,
                                        ...styles.textStyle,
                                    }}
                                    labelStyle={styles.labelStyle}
                                    renderErrorMessage={false}
                                    onChangeText={text =>
                                        setHeightAfterBoxed(text)
                                    }
                                />
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}>
                                <Input
                                    label="Width (cm)"
                                    keyboardType="number-pad"
                                    containerStyle={{
                                        ...globalStyles.input,
                                        marginTop: 5,
                                        width: '40%',
                                    }}
                                    inputContainerStyle={{
                                        borderBottomWidth: 0,
                                    }}
                                    inputStyle={{
                                        paddingVertical: 0,
                                        fontSize: 16,
                                        ...styles.textStyle,
                                    }}
                                    labelStyle={styles.labelStyle}
                                    renderErrorMessage={false}
                                    onChangeText={text =>
                                        setWidthAfterBoxed(text)
                                    }
                                />

                                <Input
                                    label="Length (cm)"
                                    keyboardType="number-pad"
                                    containerStyle={{
                                        ...globalStyles.input,
                                        marginTop: 5,
                                        width: '40%',
                                        marginLeft: 20,
                                    }}
                                    inputContainerStyle={{
                                        borderBottomWidth: 0,
                                    }}
                                    inputStyle={{
                                        paddingVertical: 0,
                                        fontSize: 16,
                                        ...styles.textStyle,
                                    }}
                                    labelStyle={styles.labelStyle}
                                    renderErrorMessage={false}
                                    onChangeText={text =>
                                        setLengthAfterBoxed(text)
                                    }
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleUploadClick}
                            style={{
                                ...globalStyles.button,
                                alignSelf: 'center',
                                marginBottom: 20,
                            }}>
                            <Text style={globalStyles.textButton}>
                                Upload Product
                            </Text>
                        </TouchableOpacity>
                        <Toast position="bottom" bottomOffset={80} />
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    )
}

export default UploadDetailScreen

const styles = StyleSheet.create({
    touch: {
        alignItems: 'center',
        justifyContent: 'center',
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
    labelStyle: {
        color: 'black',
        fontWeight: 'normal',
    },
    textStyle: {
        color: 'black',
    },
})
