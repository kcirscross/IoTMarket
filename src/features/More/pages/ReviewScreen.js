import firebase from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    Image,
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
import {Card, Input, Rating} from 'react-native-elements'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import Toast from 'react-native-toast-message'
import Ant from 'react-native-vector-icons/AntDesign'
import Ent from 'react-native-vector-icons/Entypo'
import Ion from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video'
import {useDispatch, useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../../../components/constants'
import {getAPI, postAPI} from '../../../components/utils/base_API'
import UploadImageItem from '../../Products/components/UploadImageItem'
import {addReview} from '../../Users/userSlice'

const ReviewScreen = ({navigation, route}) => {
    const [product, setProduct] = useState([])
    const [rate, setRate] = useState(5)
    const review = ['Terrible', 'Bad', 'Okay', 'Good', 'Great']
    const [modalPhotos, setModalPhotos] = useState(false)
    const [listImages, setListImages] = useState([])
    const [videoPath, setVideoPath] = useState([])
    const [typePick, setTypePick] = useState('')
    const [durationVideo, setDurationVideo] = useState(0)
    const [contentReview, setContentReview] = useState('')
    const [modalLoading, setModalLoading] = useState(false)

    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Review',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    //Get Product
    useEffect(() => {
        setModalLoading(true)
        getAPI({url: `product/${route.params._id}`})
            .then(res => {
                if (res.status === 200) {
                    setProduct(res.data.product)

                    setModalLoading(false)
                }
            })
            .catch(err => console.log('Get Product: ', err))
    }, [])

    const pickImageFromGallery = async () => {
        await launchImageLibrary(
            {
                mediaType: typePick === 'picture' ? 'photo' : 'video',
            },
            res => {
                if (res.didCancel != true) {
                    typePick === 'picture'
                        ? setListImages([...listImages, res.assets[0].uri])
                        : setVideoPath([...videoPath, res.assets[0].uri])
                }
            },
        )
    }

    const pickImageFromCamera = async () => {
        await launchCamera(
            {
                mediaType: typePick === 'picture' ? 'photo' : 'video',
            },
            res => {
                if (res.didCancel != true) {
                    typePick === 'picture'
                        ? setListImages([...listImages, res.assets[0].uri])
                        : setVideoPath([...videoPath, res.assets[0].uri])
                }
            },
        )
    }

    let getData = childData => {
        const new_arr = listImages.filter(item => item !== childData)
        setListImages(new_arr)
    }

    const handleUploadReviewClick = () => {
        if (contentReview === '') {
            Toast.show({
                text1: 'Your review must not empty.',
                type: 'error',
            })
        } else {
            //Upload image or video to Firebase
            const filePath = `reviews/${route.params._id}/${currentUser._id}`
            let list = []
            let videoUri = ''

            try {
                if (listImages.length > 0) {
                    listImages.map((item, index) => {
                        storage()
                            .ref(
                                `${filePath}/images/${listImages[
                                    index
                                ].substring(
                                    listImages[index].lastIndexOf('/') + 1,
                                )}`,
                            )
                            .putFile(item)
                            .then(async () => {
                                const result = await firebase
                                    .storage()
                                    .ref(
                                        `${filePath}/images/${listImages[
                                            index
                                        ].substring(
                                            listImages[index].lastIndexOf('/') +
                                                1,
                                        )}`,
                                    )
                                    .getDownloadURL()
                                list.push(result)
                            })
                            .then(() => {
                                if (videoPath.length > 0) {
                                    storage()
                                        .ref(
                                            `${filePath}/video/${videoPath[0].substring(
                                                videoPath[0].lastIndexOf('/') +
                                                    1,
                                            )}`,
                                        )
                                        .putFile(videoPath[0])
                                        .then(async () => {
                                            await firebase
                                                .storage()
                                                .ref(
                                                    `${filePath}/video/${videoPath[0].substring(
                                                        videoPath[0].lastIndexOf(
                                                            '/',
                                                        ) + 1,
                                                    )}`,
                                                )
                                                .getDownloadURL()
                                                .then(uri => (videoUri = uri))
                                                .then(() =>
                                                    postAPI({
                                                        url: `review/${route.params._id}`,
                                                        data: {
                                                            content:
                                                                contentReview,
                                                            starPoints: rate,
                                                            images: list,
                                                            videoUri: videoUri,
                                                        },
                                                    })
                                                        .then(res => {
                                                            if (
                                                                res.status ===
                                                                200
                                                            ) {
                                                                Toast.show({
                                                                    text1: 'Your review is uploaded.',
                                                                    type: 'success',
                                                                })

                                                                dispatch(
                                                                    addReview(
                                                                        route
                                                                            .params
                                                                            ._id,
                                                                    ),
                                                                )

                                                                setTimeout(
                                                                    () => {
                                                                        navigation.replace(
                                                                            'ProductDetail',
                                                                            {
                                                                                _id: route
                                                                                    .params
                                                                                    ._id,
                                                                            },
                                                                        )
                                                                    },
                                                                    1000,
                                                                )
                                                            }
                                                        })
                                                        .catch(err =>
                                                            console.log(err),
                                                        ),
                                                )
                                        })
                                } else {
                                    postAPI({
                                        url: `review/${route.params._id}`,
                                        data: {
                                            content: contentReview,
                                            starPoints: rate,
                                            images: list,
                                            videos: videoUri,
                                        },
                                    })
                                        .then(res => {
                                            if (res.status === 200) {
                                                Toast.show({
                                                    text1: 'Your review is uploaded.',
                                                    type: 'success',
                                                })

                                                dispatch(
                                                    addReview(route.params._id),
                                                )

                                                setTimeout(() => {
                                                    navigation.replace(
                                                        'ProductDetail',
                                                        {_id: route.params._id},
                                                    )
                                                }, 1000)
                                            }
                                        })
                                        .catch(err => console.log(err))
                                }
                            })
                    })
                } else {
                    if (videoPath.length > 0) {
                        storage()
                            .ref(
                                `${filePath}/video/${videoPath[0].substring(
                                    videoPath[0].lastIndexOf('/') + 1,
                                )}`,
                            )
                            .putFile(item)
                            .then(async () => {
                                await firebase
                                    .storage()
                                    .ref(
                                        `${filePath}/video/${videoPath[0].substring(
                                            videoPath[0].lastIndexOf('/') + 1,
                                        )}`,
                                    )
                                    .getDownloadURL()
                            })
                            .then(uri => (videoUri = uri))
                            .then(() =>
                                postAPI({
                                    url: `review/${route.params._id}`,
                                    data: {
                                        content: contentReview,
                                        starPoints: rate,
                                        images: list,
                                        videos: videoUri,
                                    },
                                })
                                    .then(res => {
                                        if (res.status === 200) {
                                            dispatch(
                                                addReview(route.params._id),
                                            )

                                            Toast.show({
                                                text1: 'Your review is uploaded.',
                                                type: 'success',
                                            })

                                            setTimeout(() => {
                                                navigation.replace(
                                                    'ProductDetail',
                                                    {_id: route.params._id},
                                                )
                                            }, 1000)
                                        }
                                    })
                                    .catch(err => console.log(err)),
                            )
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            {!modalLoading ? (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Card
                                containerStyle={{
                                    ...globalStyles.cardContainer,
                                    marginTop: 10,
                                }}>
                                <View style={{flexDirection: 'row'}}>
                                    <Image
                                        source={{uri: product.thumbnailImage}}
                                        style={{width: 70, height: 70}}
                                        resizeMethod="resize"
                                        resizeMode="contain"
                                    />

                                    <View
                                        style={{marginTop: 10, marginLeft: 10}}>
                                        <Text
                                            style={{
                                                color: 'black',
                                                fontWeight: '700',
                                                fontSize: 16,
                                            }}>
                                            {product.productName}
                                        </Text>
                                        <Text style={{color: 'black'}}>
                                            {product.description}
                                        </Text>
                                    </View>
                                </View>
                            </Card>

                            <View
                                style={{
                                    backgroundColor: 'white',
                                    marginTop: 5,
                                    borderRadius: 10,
                                    padding: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <Text
                                    style={{
                                        color: 'black',
                                        marginRight: 10,
                                        fontWeight: '600',
                                    }}>
                                    Quality of Product:
                                </Text>

                                <Rating
                                    type="custom"
                                    startingValue={5}
                                    minValue={1}
                                    defaultRating={5}
                                    imageSize={24}
                                    ratingColor="#FA8128"
                                    fractions={false}
                                    onFinishRating={value => setRate(value)}
                                />

                                <Text
                                    style={{
                                        color: '#FA8128',
                                        fontWeight: '600',
                                        marginLeft: 10,
                                    }}>
                                    {review[rate - 1]}
                                </Text>
                            </View>

                            <Card
                                containerStyle={{
                                    ...globalStyles.cardContainer,
                                    marginTop: 5,
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalPhotos(true)
                                            setTypePick('picture')
                                        }}
                                        style={styles.touchStyle}
                                        disabled={listImages.length === 5}>
                                        <Ant
                                            name="picture"
                                            color={'black'}
                                            size={64}
                                        />
                                        <Text style={{color: 'black'}}>
                                            Add Picture: {listImages.length}/5
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.touchStyle}
                                        disabled={videoPath.length === 1}
                                        onPress={() => {
                                            setModalPhotos(true)
                                            setTypePick('video')
                                        }}>
                                        <Ion
                                            name="videocam-outline"
                                            color={'black'}
                                            size={64}
                                        />
                                        <Text style={{color: 'black'}}>
                                            Add Video: {videoPath.length}/1
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {videoPath.length + listImages.length > 0 && (
                                    <ScrollView
                                        horizontal
                                        style={{
                                            height: 130,
                                            paddingVertical: 5,
                                            paddingLeft: 10,
                                        }}>
                                        {videoPath.length !== 0 && (
                                            <View
                                                style={{
                                                    backgroundColor:
                                                        SECONDARY_COLOR,
                                                    borderRadius: 10,
                                                    marginLeft: 0,
                                                    marginRight: 8,
                                                }}>
                                                <TouchableOpacity
                                                    style={{zIndex: 1}}
                                                    onPress={() => {
                                                        setVideoPath([])
                                                    }}>
                                                    <Ion
                                                        name="close-circle"
                                                        size={24}
                                                        color="black"
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            right: 0,
                                                        }}
                                                    />
                                                </TouchableOpacity>

                                                <Video
                                                    source={{uri: videoPath[0]}}
                                                    style={{
                                                        width: 150,
                                                        height: 120,
                                                        zIndex: 0,
                                                    }}
                                                    resizeMode="contain"
                                                    onLoad={payload =>
                                                        setDurationVideo(
                                                            payload.duration,
                                                        )
                                                    }
                                                />

                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        backgroundColor:
                                                            '#666666',
                                                        width: '100%',
                                                        opacity: 0.8,
                                                        alignItems: 'center',
                                                        paddingLeft: 10,
                                                        borderBottomLeftRadius: 10,
                                                        borderBottomRightRadius: 10,
                                                    }}>
                                                    <Ent
                                                        name="video"
                                                        size={24}
                                                        color="black"
                                                    />
                                                    <Text
                                                        style={{
                                                            color: 'white',
                                                            marginLeft: 10,
                                                        }}>
                                                        {durationVideo}s
                                                    </Text>
                                                </View>
                                            </View>
                                        )}

                                        {listImages.length > 0 &&
                                            listImages.map(item => (
                                                <UploadImageItem
                                                    onPress={getData}
                                                    key={item}
                                                    imageURI={item}
                                                />
                                            ))}
                                    </ScrollView>
                                )}
                            </Card>

                            <Input
                                label="Your Review"
                                labelStyle={{color: 'black'}}
                                containerStyle={styles.textContainer}
                                inputContainerStyle={{
                                    borderBottomWidth: 0,
                                    padding: 5,
                                    borderRadius: 10,
                                }}
                                inputStyle={{
                                    padding: 0,
                                    fontSize: 16,
                                    color: 'black',
                                    justifyContent: 'flex-start',
                                    textAlignVertical: 'top',
                                }}
                                numberOfLines={5}
                                renderErrorMessage={false}
                                onChangeText={text => setContentReview(text)}
                                multiline={true}
                            />

                            <View style={{flex: 1}} />

                            <TouchableOpacity
                                onPress={handleUploadReviewClick}
                                style={{
                                    ...globalStyles.button,
                                    alignSelf: 'center',
                                    marginBottom: 10,
                                }}>
                                <Text style={globalStyles.textButton}>
                                    Upload Review
                                </Text>
                            </TouchableOpacity>

                            <Toast position="bottom" bottomOffset={70} />

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
                                                Choose your {typePick} from?
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
                        </ScrollView>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            ) : (
                <ModalLoading visible={modalLoading} />
            )}
        </SafeAreaView>
    )
}

export default ReviewScreen

const styles = StyleSheet.create({
    touchStyle: {
        borderColor: SECONDARY_COLOR,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 30,
        alignItems: 'center',
        paddingVertical: 5,
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
    textContainer: {
        ...globalStyles.input,
        width: '100%',
    },
})
