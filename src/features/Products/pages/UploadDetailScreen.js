import React, {useLayoutEffect, useState} from 'react'
import {
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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import UploadImageItem from '../components/UploadImageItem'
import DropDownPicker from 'react-native-dropdown-picker'
import {Button, Input} from 'react-native-elements'
import {Alert} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firebase from '@react-native-firebase/app'
import {useSelector} from 'react-redux'

const UploadDetailScreen = ({navigation, route}) => {
    const currentUser = useSelector(state => state.user)
    const [listImages, setListImages] = useState([])
    const [modalLoading, setModalLoading] = useState(false)
    const [modalPhotos, setModalPhotos] = useState(false)
    const [downloadImage, setDownloadImage] = useState([])

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
    })

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
                maxHeight: 200,
                maxWidth: 200,
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
                maxHeight: 200,
                maxWidth: 200,
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
                                                        navigation.goBack(),
                                                },
                                            ],
                                        )
                                    }
                                })
                                .catch(err => {
                                    console.log(err.message)
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
            lengthAfterBoxed == ''
        ) {
            Alert.alert('Please fill in all field.')
        } else {
            uploadProduct()
        }
    }

    return (
        <SafeAreaView style={globalStyles.container}>
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
                                // onTouchStart={() => setModalPhotos(false)}
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
                            <TouchableOpacity
                                style={styles.touch}
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
                        </View>

                        <Input
                            placeholder="Product Name"
                            label="Product Name"
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
                            renderErrorMessage={false}
                            onChangeText={text => setProductName(text)}
                        />

                        <Input
                            placeholder="Product Description"
                            label="Product Description"
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
                            renderErrorMessage={false}
                            onChangeText={text => setProductDescription(text)}
                        />

                        <Input
                            placeholder="Price"
                            label="Price"
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
                            renderErrorMessage={false}
                            onChangeText={text => setProductPrice(text)}
                        />

                        <Input
                            placeholder="Number in Stock"
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
                            renderErrorMessage={false}
                            onChangeText={text => setProductAmount(text)}
                        />
                        <Text
                            style={{
                                ...styles.labelStyle,
                                fontSize: 18,
                                marginTop: 5,
                            }}>
                            Size Of Product Before Boxed
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}>
                            <Input
                                placeholder="Weight"
                                label="Weight"
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
                                renderErrorMessage={false}
                                onChangeText={text =>
                                    setWeightBeforeBoxed(text)
                                }
                            />
                            <Input
                                placeholder="Height"
                                label="Height"
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
                                placeholder="Width"
                                label="Width"
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
                                renderErrorMessage={false}
                                onChangeText={text => setWidthBeforeBoxed(text)}
                            />
                            <Input
                                placeholder="Length"
                                label="Length"
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
                                marginTop: 5,
                            }}>
                            Size Of Product After Boxed
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}>
                            <Input
                                placeholder="Weight"
                                label="Weight"
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
                                renderErrorMessage={false}
                                onChangeText={text => setWeightAfterBoxed(text)}
                            />
                            <Input
                                placeholder="Height"
                                label="Height"
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
                                renderErrorMessage={false}
                                onChangeText={text => setHeightAfterBoxed(text)}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}>
                            <Input
                                placeholder="Width"
                                label="Width"
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
                                renderErrorMessage={false}
                                onChangeText={text => setWidthAfterBoxed(text)}
                            />
                            <Input
                                placeholder="Length"
                                label="Length"
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
                                renderErrorMessage={false}
                                onChangeText={text => setLengthAfterBoxed(text)}
                            />
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
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: 'dashed',
        padding: 10,
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
