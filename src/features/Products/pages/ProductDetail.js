import axios from 'axios'
import React, {useLayoutEffect} from 'react'
import {useEffect} from 'react'
import {SafeAreaView, StyleSheet, Text, View} from 'react-native'
import {Avatar, Card} from 'react-native-elements'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import BottomMenuBar from '../components/BottomMenuBar'

const ProductDetail = ({navigation, route}) => {
    const {_id} = route.params.data

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

    useEffect(() => {
        axios({
            method: 'get',
            url: `${API_URL}/product`,
            params: {
                productId: _id,
            },
        }).then(res => console.log(res.data))
    }, [])

    return (
        <SafeAreaView style={globalStyles.container}>
            {/* <View>
                <Carousel
                    data={listImages}
                    style={{
                        marginBottom: 10,
                    }}
                    initialIndex={0}
                    ref={carouselRef}
                    onScrollEnd={handleCarouselScrollEnd}
                    itemWidth={Dimensions.get('window').width * 0.88}
                    containerWidth={Dimensions.get('window').width * 0.95}
                    separatorWidth={2}
                    inActiveOpacity={0.5}
                    onSnapToItem={index => setIndex(index)}
                    renderItem={({item}) => (
                        <View>
                            <Image
                                source={{uri: item}}
                                resizeMethod="scale"
                                resizeMode="contain"
                                style={{
                                    width: '100%',
                                    height: 250,
                                    flex: 1,
                                    borderRadius: 10,
                                    elevation: 3,
                                }}
                            />
                        </View>
                    )}
                />
                <SimplePaginationDot
                    currentIndex={currentIndex}
                    length={listImages.length}
                />
            </View> */}
            {/* <Card containerStyle={globalStyles.cardContainer}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <Avatar
                        rounded
                        size={64}
                        source={require('~/assets/images/logo.jpg')}
                    />
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: 'black',
                            marginLeft: 10,
                        }}>
                        {productDisplayName}
                    </Text>
                </View>
            </Card>
            <Card containerStyle={globalStyles.cardContainer}>
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                    {productTitle}
                </Text>
                <Text>{productDescription}</Text>
            </Card> */}

            <BottomMenuBar />
        </SafeAreaView>
    )
}

export default ProductDetail

const styles = StyleSheet.create({})
