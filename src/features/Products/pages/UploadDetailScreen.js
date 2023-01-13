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
import Ion from 'react-native-vector-icons/Ionicons'
import {useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    API_URL,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
} from '../../../components/constants'
import {patchAPI, postAPI} from '../../../components/utils/base_API'
import UploadImageItem from '../components/UploadImageItem'

const UploadDetailScreen = ({navigation, route}) => {
    const currentUser = useSelector(state => state.user)
    const [listImages, setListImages] = useState([])
    const [modalLoading, setModalLoading] = useState(true)
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

    const isEdit = route.params.isEdit
    const product = route.params.product
    const [defaultSubCategory, setDefaultSubCategory] = useState('')
    const [firstLoading, setFirstLoading] = useState(true)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.category.categoryName,
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
            url: `${API_URL}/subcategory/${route.params.category._id}`,
        })
            .then(res => {
                if (res.status == 200) {
                    res.data.subcategories.forEach(sub => {
                        listSub.push({
                            label: sub.subcategoryName,
                            value: sub._id,
                        })
                        isEdit &&
                            sub._id === product.subcategoryId &&
                            setDefaultSubCategory(sub)
                    })
                    setListSubCategory(listSub)

                    setModalLoading(false)
                    setFirstLoading(false)
                }
            })
            .catch(error => console.log('SubCategory: ', error))
    }, [])

    //Set Variable if in Edit mode
    useEffect(() => {
        if (isEdit) {
            setListImages(product.detailImages)
            setChosenSubCategory(defaultSubCategory._id)
            setProductName(product.productName)
            setProductDescription(product.description)
            setProductPrice(product.price)
            setProductAmount(product.numberInStock)
            setChosenCondition(product.condition)
            setWeightBeforeBoxed(product.weight)
            setHeightBeforeBoxed(product.height)
            setWidthBeforeBoxed(product.width)
            setLengthBeforeBoxed(product.length)
            setWeightAfterBoxed(product.weightAfterBoxing)
            setHeightAfterBoxed(product.heightAfterBoxing)
            setWidthAfterBoxed(product.widthAfterBoxing)
            setLengthAfterBoxed(product.lengthAfterBoxing)
        }
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
                if (res.didCancel !== true) {
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
        let list = []

        try {
            listImages.map(async (item, index) => {
                await firebase
                    .storage()
                    .ref(
                        `${filePath}/${listImages[index].substring(
                            listImages[index].lastIndexOf('/') + 1,
                        )}`,
                    )
                    .putFile(item)
                    .then(() => {
                        if (index === listImages.length - 1) {
                            firebase
                                .storage()
                                .ref(filePath)
                                .list()
                                .then(result => {
                                    result.items.map(
                                        async (item, index) =>
                                            await firebase
                                                .storage()
                                                .ref(item.fullPath)
                                                .getDownloadURL()
                                                .then(url => {
                                                    list.push(url)
                                                    if (
                                                        index ===
                                                        result.items.length - 1
                                                    ) {
                                                        list.unshift(filePath)
                                                        postAPI({
                                                            url: 'product',
                                                            data: {
                                                                thumbnailImage:
                                                                    list[1],
                                                                productName:
                                                                    productName,
                                                                subcategoryId:
                                                                    chosenSubCategory,
                                                                description:
                                                                    productDescription,
                                                                categoryId:
                                                                    route.params
                                                                        .category
                                                                        ._id,
                                                                detailImages:
                                                                    list,
                                                                video: '',
                                                                weight: parseFloat(
                                                                    weightBeforeBoxed,
                                                                ),
                                                                height: parseFloat(
                                                                    heightBeforeBoxed,
                                                                ),
                                                                width: parseFloat(
                                                                    widthBeforeBoxed,
                                                                ),
                                                                length: parseFloat(
                                                                    lengthBeforeBoxed,
                                                                ),
                                                                weightAfterBoxing:
                                                                    parseFloat(
                                                                        weightAfterBoxed,
                                                                    ),
                                                                heightAfterBoxing:
                                                                    parseFloat(
                                                                        heightAfterBoxed,
                                                                    ),
                                                                widthAfterBoxing:
                                                                    parseFloat(
                                                                        widthAfterBoxed,
                                                                    ),
                                                                lengthAfterBoxing:
                                                                    parseFloat(
                                                                        lengthAfterBoxed,
                                                                    ),
                                                                price: productPrice,
                                                                numberInStock:
                                                                    currentUser.storeId !==
                                                                    undefined
                                                                        ? parseFloat(
                                                                              productAmount,
                                                                          )
                                                                        : 1,
                                                                condition:
                                                                    chosenCondition,
                                                            },
                                                        })
                                                            .then(res => {
                                                                if (
                                                                    res.status ===
                                                                    200
                                                                ) {
                                                                    setModalLoading(
                                                                        false,
                                                                    )
                                                                    Alert.alert(
                                                                        'Upload product successfully.',
                                                                        '',
                                                                        [
                                                                            {
                                                                                text: 'OK',
                                                                                onPress:
                                                                                    () =>
                                                                                        navigation.replace(
                                                                                            'Profile',
                                                                                            {
                                                                                                0:
                                                                                                    currentUser.storeId !=
                                                                                                    undefined
                                                                                                        ? currentUser.storeId
                                                                                                        : currentUser._id,
                                                                                            },
                                                                                        ),
                                                                            },
                                                                        ],
                                                                    )
                                                                }
                                                            })
                                                            .catch(err => {
                                                                console.log(err)
                                                                setModalLoading(
                                                                    false,
                                                                )
                                                            })
                                                    }
                                                }),
                                    )
                                })
                        }
                    })
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    const updateProduct = (deleteImages, containImages) => {
        // setModalLoading(true)
        let listName = []
        if (deleteImages.length > 0) {
            deleteImages.forEach(image => {
                listName.push(image.split('%2Fimages%2F')[1].split('?alt')[0])
            })

            listName.forEach(name => {
                firebase
                    .storage()
                    .ref(`${route.params.bucketPath}/${name}`)
                    .delete()
            })

            if (containImages.length > 0) {
                if (
                    JSON.stringify(listImages) === JSON.stringify(containImages)
                ) {
                    containImages.unshift(route.params.bucketPath)

                    patchAPI({
                        url: `product/${product._id}`,
                        data: {
                            thumbnailImage: containImages[1],
                            productName: productName,
                            subcategoryId: chosenSubCategory,
                            description: productDescription,
                            categoryId: route.params.category._id,
                            detailImages: containImages,
                            video: '',
                            weight: parseFloat(weightBeforeBoxed),
                            height: parseFloat(heightBeforeBoxed),
                            width: parseFloat(widthBeforeBoxed),
                            length: parseFloat(lengthBeforeBoxed),
                            weightAfterBoxing: parseFloat(weightAfterBoxed),
                            heightAfterBoxing: parseFloat(heightAfterBoxed),
                            widthAfterBoxing: parseFloat(widthAfterBoxed),
                            lengthAfterBoxing: parseFloat(lengthAfterBoxed),
                            price: productPrice,
                            numberInStock:
                                currentUser.storeId !== undefined
                                    ? parseFloat(productAmount)
                                    : 1,
                            condition: chosenCondition,
                        },
                    })
                        .then(res => {
                            if (res.status === 200) {
                                setModalLoading(false)
                                Alert.alert(
                                    'Update product successfully.',
                                    '',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => navigation.goBack(),
                                        },
                                    ],
                                )
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            setModalLoading(false)
                        })
                } else {
                    let listURL = []

                    listImages.forEach((image, index) => {
                        if (!containImages.includes(image)) {
                            firebase
                                .storage()
                                .ref(
                                    `${
                                        route.params.bucketPath
                                    }/${image.substring(
                                        image.lastIndexOf('/') + 1,
                                    )}`,
                                )
                                .putFile(image)
                                .then(() => {
                                    if (index === listImages.length - 1) {
                                        firebase
                                            .storage()
                                            .ref(route.params.bucketPath)
                                            .list()
                                            .then(results => {
                                                results.items.map(
                                                    (item, index) => {
                                                        firebase
                                                            .storage()
                                                            .ref(item.fullPath)
                                                            .getDownloadURL()
                                                            .then(url => {
                                                                listURL.push(
                                                                    url,
                                                                )

                                                                if (
                                                                    index ===
                                                                    results
                                                                        .items
                                                                        .length -
                                                                        1
                                                                ) {
                                                                    listURL.unshift(
                                                                        route
                                                                            .params
                                                                            .bucketPath,
                                                                    )

                                                                    patchAPI({
                                                                        url: `product/${product._id}`,
                                                                        data: {
                                                                            thumbnailImage:
                                                                                listURL[1],
                                                                            productName:
                                                                                productName,
                                                                            subcategoryId:
                                                                                chosenSubCategory,
                                                                            description:
                                                                                productDescription,
                                                                            categoryId:
                                                                                route
                                                                                    .params
                                                                                    .category
                                                                                    ._id,
                                                                            detailImages:
                                                                                listURL,
                                                                            video: '',
                                                                            weight: parseFloat(
                                                                                weightBeforeBoxed,
                                                                            ),
                                                                            height: parseFloat(
                                                                                heightBeforeBoxed,
                                                                            ),
                                                                            width: parseFloat(
                                                                                widthBeforeBoxed,
                                                                            ),
                                                                            length: parseFloat(
                                                                                lengthBeforeBoxed,
                                                                            ),
                                                                            weightAfterBoxing:
                                                                                parseFloat(
                                                                                    weightAfterBoxed,
                                                                                ),
                                                                            heightAfterBoxing:
                                                                                parseFloat(
                                                                                    heightAfterBoxed,
                                                                                ),
                                                                            widthAfterBoxing:
                                                                                parseFloat(
                                                                                    widthAfterBoxed,
                                                                                ),
                                                                            lengthAfterBoxing:
                                                                                parseFloat(
                                                                                    lengthAfterBoxed,
                                                                                ),
                                                                            price: productPrice,
                                                                            numberInStock:
                                                                                currentUser.storeId !==
                                                                                undefined
                                                                                    ? parseFloat(
                                                                                          productAmount,
                                                                                      )
                                                                                    : 1,
                                                                            condition:
                                                                                chosenCondition,
                                                                        },
                                                                    })
                                                                        .then(
                                                                            res => {
                                                                                if (
                                                                                    res.status ===
                                                                                    200
                                                                                ) {
                                                                                    setModalLoading(
                                                                                        false,
                                                                                    )
                                                                                    Alert.alert(
                                                                                        'Update product successfully.',
                                                                                        '',
                                                                                        [
                                                                                            {
                                                                                                text: 'OK',
                                                                                                onPress:
                                                                                                    () =>
                                                                                                        navigation.goBack(),
                                                                                            },
                                                                                        ],
                                                                                    )
                                                                                }
                                                                            },
                                                                        )
                                                                        .catch(
                                                                            err => {
                                                                                console.log(
                                                                                    err,
                                                                                )
                                                                                setModalLoading(
                                                                                    false,
                                                                                )
                                                                            },
                                                                        )
                                                                }
                                                            })
                                                    },
                                                )
                                            })
                                    }
                                })
                        }
                    })
                }
            } else {
                let listURL = []

                listImages.forEach((image, index) => {
                    firebase
                        .storage()
                        .ref(
                            `${route.params.bucketPath}/${image.substring(
                                image.lastIndexOf('/') + 1,
                            )}`,
                        )
                        .putFile(image)
                        .then(() => {
                            if (index === listImages.length - 1) {
                                firebase
                                    .storage()
                                    .ref(route.params.bucketPath)
                                    .list()
                                    .then(results => {
                                        results.items.map((item, index) => {
                                            firebase
                                                .storage()
                                                .ref(item.fullPath)
                                                .getDownloadURL()
                                                .then(url => {
                                                    listURL.push(url)

                                                    if (
                                                        index ===
                                                        results.items.length - 1
                                                    ) {
                                                        listURL.unshift(
                                                            route.params
                                                                .bucketPath,
                                                        )

                                                        patchAPI({
                                                            url: `product/${product._id}`,
                                                            data: {
                                                                thumbnailImage:
                                                                    listURL[1],
                                                                productName:
                                                                    productName,
                                                                subcategoryId:
                                                                    chosenSubCategory,
                                                                description:
                                                                    productDescription,
                                                                categoryId:
                                                                    route.params
                                                                        .category
                                                                        ._id,
                                                                detailImages:
                                                                    listURL,
                                                                video: '',
                                                                weight: parseFloat(
                                                                    weightBeforeBoxed,
                                                                ),
                                                                height: parseFloat(
                                                                    heightBeforeBoxed,
                                                                ),
                                                                width: parseFloat(
                                                                    widthBeforeBoxed,
                                                                ),
                                                                length: parseFloat(
                                                                    lengthBeforeBoxed,
                                                                ),
                                                                weightAfterBoxing:
                                                                    parseFloat(
                                                                        weightAfterBoxed,
                                                                    ),
                                                                heightAfterBoxing:
                                                                    parseFloat(
                                                                        heightAfterBoxed,
                                                                    ),
                                                                widthAfterBoxing:
                                                                    parseFloat(
                                                                        widthAfterBoxed,
                                                                    ),
                                                                lengthAfterBoxing:
                                                                    parseFloat(
                                                                        lengthAfterBoxed,
                                                                    ),
                                                                price: productPrice,
                                                                numberInStock:
                                                                    currentUser.storeId !==
                                                                    undefined
                                                                        ? parseFloat(
                                                                              productAmount,
                                                                          )
                                                                        : 1,
                                                                condition:
                                                                    chosenCondition,
                                                            },
                                                        })
                                                            .then(res => {
                                                                if (
                                                                    res.status ===
                                                                    200
                                                                ) {
                                                                    setModalLoading(
                                                                        false,
                                                                    )
                                                                    Alert.alert(
                                                                        'Update product successfully.',
                                                                        '',
                                                                        [
                                                                            {
                                                                                text: 'OK',
                                                                                onPress:
                                                                                    () =>
                                                                                        navigation.goBack(),
                                                                            },
                                                                        ],
                                                                    )
                                                                }
                                                            })
                                                            .catch(err => {
                                                                console.log(err)
                                                                setModalLoading(
                                                                    false,
                                                                )
                                                            })
                                                    }
                                                })
                                        })
                                    })
                            }
                        })
                })
            }
        } else {
            if (
                JSON.stringify(listImages) ===
                JSON.stringify(product.detailImages)
            ) {
                containImages.unshift(route.params.bucketPath)

                patchAPI({
                    url: `product/${product._id}`,
                    data: {
                        thumbnailImage: containImages[1],
                        productName: productName,
                        subcategoryId: chosenSubCategory,
                        description: productDescription,
                        categoryId: route.params.category._id,
                        detailImages: containImages,
                        video: '',
                        weight: parseFloat(weightBeforeBoxed),
                        height: parseFloat(heightBeforeBoxed),
                        width: parseFloat(widthBeforeBoxed),
                        length: parseFloat(lengthBeforeBoxed),
                        weightAfterBoxing: parseFloat(weightAfterBoxed),
                        heightAfterBoxing: parseFloat(heightAfterBoxed),
                        widthAfterBoxing: parseFloat(widthAfterBoxed),
                        lengthAfterBoxing: parseFloat(lengthAfterBoxed),
                        price: productPrice,
                        numberInStock:
                            currentUser.storeId !== undefined
                                ? parseFloat(productAmount)
                                : 1,
                        condition: chosenCondition,
                    },
                })
                    .then(res => {
                        if (res.status === 200) {
                            setModalLoading(false)
                            Alert.alert('Update product successfully.', '', [
                                {
                                    text: 'OK',
                                    onPress: () => navigation.goBack(),
                                },
                            ])
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        setModalLoading(false)
                    })
            } else {
                let listURL = []

                listImages.forEach((image, index) => {
                    if (!containImages.includes(image)) {
                        firebase
                            .storage()
                            .ref(
                                `${route.params.bucketPath}/${image.substring(
                                    image.lastIndexOf('/') + 1,
                                )}`,
                            )
                            .putFile(image)
                            .then(() => {
                                if (index === listImages.length - 1) {
                                    firebase
                                        .storage()
                                        .ref(route.params.bucketPath)
                                        .list()
                                        .then(results => {
                                            results.items.map((item, index) => {
                                                firebase
                                                    .storage()
                                                    .ref(item.fullPath)
                                                    .getDownloadURL()
                                                    .then(url => {
                                                        listURL.push(url)

                                                        if (
                                                            index ===
                                                            results.items
                                                                .length -
                                                                1
                                                        ) {
                                                            listURL.unshift(
                                                                route.params
                                                                    .bucketPath,
                                                            )

                                                            patchAPI({
                                                                url: `product/${product._id}`,
                                                                data: {
                                                                    thumbnailImage:
                                                                        listURL[1],
                                                                    productName:
                                                                        productName,
                                                                    subcategoryId:
                                                                        chosenSubCategory,
                                                                    description:
                                                                        productDescription,
                                                                    categoryId:
                                                                        route
                                                                            .params
                                                                            .category
                                                                            ._id,
                                                                    detailImages:
                                                                        listURL,
                                                                    video: '',
                                                                    weight: parseFloat(
                                                                        weightBeforeBoxed,
                                                                    ),
                                                                    height: parseFloat(
                                                                        heightBeforeBoxed,
                                                                    ),
                                                                    width: parseFloat(
                                                                        widthBeforeBoxed,
                                                                    ),
                                                                    length: parseFloat(
                                                                        lengthBeforeBoxed,
                                                                    ),
                                                                    weightAfterBoxing:
                                                                        parseFloat(
                                                                            weightAfterBoxed,
                                                                        ),
                                                                    heightAfterBoxing:
                                                                        parseFloat(
                                                                            heightAfterBoxed,
                                                                        ),
                                                                    widthAfterBoxing:
                                                                        parseFloat(
                                                                            widthAfterBoxed,
                                                                        ),
                                                                    lengthAfterBoxing:
                                                                        parseFloat(
                                                                            lengthAfterBoxed,
                                                                        ),
                                                                    price: productPrice,
                                                                    numberInStock:
                                                                        currentUser.storeId !==
                                                                        undefined
                                                                            ? parseFloat(
                                                                                  productAmount,
                                                                              )
                                                                            : 1,
                                                                    condition:
                                                                        chosenCondition,
                                                                },
                                                            })
                                                                .then(res => {
                                                                    if (
                                                                        res.status ===
                                                                        200
                                                                    ) {
                                                                        setModalLoading(
                                                                            false,
                                                                        )
                                                                        Alert.alert(
                                                                            'Update product successfully.',
                                                                            '',
                                                                            [
                                                                                {
                                                                                    text: 'OK',
                                                                                    onPress:
                                                                                        () =>
                                                                                            navigation.goBack(),
                                                                                },
                                                                            ],
                                                                        )
                                                                    }
                                                                })
                                                                .catch(err => {
                                                                    console.log(
                                                                        err,
                                                                    )
                                                                    setModalLoading(
                                                                        false,
                                                                    )
                                                                })
                                                        }
                                                    })
                                            })
                                        })
                                }
                            })
                    }
                })
            }
        }
    }

    const handleUploadClick = () => {
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

    const handleUpdateClick = () => {
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
            chosenCondition == '' ||
            listImages.length < 1
        ) {
            Toast.show({
                type: 'error',
                text1: 'Please fill in all field.',
            })
        } else {
            let deleteImages = []
            let containImages = []
            product.detailImages.forEach((image, index) => {
                !listImages.includes(image)
                    ? deleteImages.push(image)
                    : containImages.push(image)
                index === product.detailImages.length - 1 &&
                    updateProduct(deleteImages, containImages)
            })
        }
    }

    return !firstLoading ? (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                opacity: modalLoading + modalPhotos ? 0.5 : 1,
            }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView>
                    <ModalLoading visible={modalLoading} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalPhotos}>
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
                                                setModalPhotos(false)
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
                                            setModalPhotos(false)
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
                                            setModalPhotos(false)
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
                                placeholder={
                                    isEdit
                                        ? defaultSubCategory.subcategoryName
                                        : 'Select a sub category'
                                }
                                onSelectItem={item =>
                                    setChosenSubCategory(item.value)
                                }
                                style={styles.dropStyle}
                                dropDownContainerStyle={{
                                    borderColor: SECONDARY_COLOR,
                                }}
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
                                containerStyle={styles.textContainer}
                                inputContainerStyle={styles.inputContainer}
                                defaultValue={isEdit && product.productName}
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
                                defaultValue={isEdit && product.description}
                                containerStyle={styles.textContainer}
                                inputContainerStyle={styles.inputContainer}
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
                                containerStyle={styles.textContainer}
                                inputContainerStyle={styles.inputContainer}
                                defaultValue={isEdit && product.price}
                                inputStyle={{
                                    paddingVertical: 0,
                                    fontSize: 16,
                                    ...styles.textStyle,
                                }}
                                labelStyle={styles.labelStyle}
                                renderErrorMessage={false}
                                onChangeText={text => setProductPrice(text)}
                            />

                            {currentUser.storeId !== undefined && (
                                <Input
                                    label="Number in Stock"
                                    keyboardType="number-pad"
                                    defaultValue={
                                        isEdit &&
                                        product.numberInStock.toString()
                                    }
                                    containerStyle={styles.textContainer}
                                    inputContainerStyle={styles.inputContainer}
                                    inputStyle={{
                                        paddingVertical: 0,
                                        fontSize: 16,
                                        ...styles.textStyle,
                                    }}
                                    labelStyle={styles.labelStyle}
                                    renderErrorMessage={false}
                                    onChangeText={text =>
                                        setProductAmount(text)
                                    }
                                />
                            )}

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
                                placeholder={
                                    isEdit
                                        ? product.condition
                                        : 'Select a condition'
                                }
                                style={styles.dropStyle}
                                dropDownContainerStyle={{
                                    borderColor: SECONDARY_COLOR,
                                }}
                                onSelectItem={item =>
                                    setChosenCondition(item.value)
                                }
                                dropDownDirection="TOP"
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
                                        ...styles.textContainer,
                                        width: '40%',
                                        marginTop: 0,
                                    }}
                                    defaultValue={
                                        isEdit && product.weight.toString()
                                    }
                                    inputContainerStyle={styles.inputContainer}
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
                                        ...styles.textContainer,
                                        width: '40%',
                                        marginTop: 0,
                                        marginLeft: 20,
                                    }}
                                    defaultValue={
                                        isEdit && product.height.toString()
                                    }
                                    inputContainerStyle={styles.inputContainer}
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
                                        ...styles.textContainer,
                                        width: '40%',
                                        marginTop: 5,
                                    }}
                                    defaultValue={
                                        isEdit && product.width.toString()
                                    }
                                    inputContainerStyle={styles.inputContainer}
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
                                        ...styles.textContainer,
                                        width: '40%',
                                        marginTop: 5,
                                        marginLeft: 20,
                                    }}
                                    defaultValue={
                                        isEdit && product.length.toString()
                                    }
                                    inputContainerStyle={styles.inputContainer}
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
                                        ...styles.textContainer,
                                        width: '40%',
                                        marginTop: 0,
                                    }}
                                    defaultValue={
                                        isEdit &&
                                        product.weightAfterBoxing.toString()
                                    }
                                    inputContainerStyle={styles.inputContainer}
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
                                        ...styles.textContainer,
                                        width: '40%',
                                        marginTop: 0,
                                        marginLeft: 20,
                                    }}
                                    defaultValue={
                                        isEdit &&
                                        product.heightAfterBoxing.toString()
                                    }
                                    inputContainerStyle={styles.inputContainer}
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
                                        ...styles.textContainer,
                                        width: '40%',
                                        marginTop: 5,
                                    }}
                                    defaultValue={
                                        isEdit &&
                                        product.widthAfterBoxing.toString()
                                    }
                                    inputContainerStyle={styles.inputContainer}
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
                                        ...styles.textContainer,
                                        width: '40%',
                                        marginTop: 5,
                                        marginLeft: 20,
                                    }}
                                    defaultValue={
                                        isEdit &&
                                        product.lengthAfterBoxing.toString()
                                    }
                                    inputContainerStyle={styles.inputContainer}
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

                        {isEdit ? (
                            <TouchableOpacity
                                onPress={handleUpdateClick}
                                style={{
                                    ...globalStyles.button,
                                    alignSelf: 'center',
                                    marginBottom: 20,
                                }}>
                                <Text style={globalStyles.textButton}>
                                    Update Product
                                </Text>
                            </TouchableOpacity>
                        ) : (
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
                        )}
                        <Toast position="bottom" bottomOffset={80} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    ) : (
        <SafeAreaView>
            <ModalLoading visible={modalLoading} />
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
        alignItems: 'center',
    },
    labelStyle: {
        color: 'black',
        fontWeight: 'normal',
    },
    textStyle: {
        color: 'black',
    },
    dropStyle: {
        backgroundColor: 'white',
        shadowColor: PRIMARY_COLOR,
        elevation: 10,
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderColor: SECONDARY_COLOR,
    },
    textContainer: {
        marginTop: 10,
        paddingHorizontal: 0,
    },
    inputContainer: {
        ...globalStyles.input,
        width: '100%',
        marginTop: 0,
        borderBottomWidth: 0,
        paddingVertical: 5,
    },
})
