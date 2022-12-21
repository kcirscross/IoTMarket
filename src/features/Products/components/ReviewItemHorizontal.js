import React, {useEffect, useState} from 'react'
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {Avatar, Divider, Rating} from 'react-native-elements'
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../../../components/constants'
import {getAPI} from '../../../components/utils/base_API'

const ReviewItemHorizontal = ({navigation, review}) => {
    // console.log(review)

    const [userInfo, setUserInfo] = useState([])
    const [loading, setLoading] = useState(true)
    const [storeInfo, setStoreInfo] = useState([])

    //Get User Information
    useEffect(() => {
        review !== undefined &&
            getAPI({url: `user/${review.reviewerId}`})
                .then(res => {
                    if (res.status === 200) {
                        setUserInfo(res.data.userInfo)

                        if (res.data.userInfo.storeId !== undefined) {
                            getAPI({
                                url: `store/${res.data.userInfo.storeId}`,
                            }).then(res => {
                                if (res.status === 200) {
                                    setStoreInfo(res.data.store)

                                    setLoading(false)
                                }
                            })
                        }

                        setLoading(false)
                    }
                })
                .catch(err => console.log('Get User: ', err))
    }, [])

    return (
        !loading && (
            <View style={styles.container}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 5,
                    }}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('StoreProfile', {
                                store: storeInfo,
                                ownerInfo: userInfo,
                            })
                        }>
                        <Avatar
                            rounded
                            size={50}
                            source={{uri: userInfo.avatar}}
                        />
                    </TouchableOpacity>

                    <View style={{marginLeft: 10}}>
                        <Text
                            style={{
                                color: 'black',
                                fontWeight: '600',
                                fontSize: 15,
                            }}>
                            {userInfo.fullName}
                        </Text>
                        <Rating
                            type="custom"
                            readonly
                            startingValue={review.starPoints}
                            imageSize={13}
                            ratingColor="#FA8128"
                            fractions={false}
                        />
                    </View>
                </View>

                <Text
                    style={{
                        color: 'black',
                    }}>
                    {review.content}
                </Text>

                {review.images.length + review.videos.length > 0 && (
                    <ScrollView
                        contentContainerStyle={{flexDirection: 'row'}}
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {review.videos[0] != '' && (
                            <Image
                                source={{uri: review.videos[0]}}
                                style={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: SECONDARY_COLOR,
                                    borderRadius: 10,
                                    marginHorizontal: 2,
                                    borderColor: SECONDARY_COLOR,
                                    borderWidth: 3,
                                    margin: 5,
                                }}
                                resizeMethod="resize"
                                resizeMode="contain"
                            />
                        )}
                        {review.images.length > 0 &&
                            review.images.map((image, index) => (
                                <Image
                                    source={{uri: image}}
                                    key={index}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: SECONDARY_COLOR,
                                        borderRadius: 10,
                                        marginHorizontal: 2,
                                        borderColor: SECONDARY_COLOR,
                                        borderWidth: 3,
                                        margin: 5,
                                    }}
                                    resizeMethod="resize"
                                    resizeMode="contain"
                                />
                            ))}
                    </ScrollView>
                )}

                <Divider color={PRIMARY_COLOR} width={1} />
            </View>
        )
    )
}

export default ReviewItemHorizontal

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
    },
})
