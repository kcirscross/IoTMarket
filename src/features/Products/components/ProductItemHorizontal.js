import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {Card} from 'react-native-elements'
import {TouchableOpacity} from 'react-native'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {Image} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {API_URL} from '../../../components/constants'
import {useDispatch} from 'react-redux'
import {removeFavorite} from '../favoriteSlice'

const ProductItemHorizontal = ({navigation, product, type}) => {
    const dispatch = useDispatch()

    const handleRemoveFavoriteClick = async () => {
        try {
            const token = await AsyncStorage.getItem('token')

            axios({
                method: 'patch',
                url: `${API_URL}/user/unfavorite/${product._id}`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }).then(res => {
                if (res.status == 200) {
                    dispatch(removeFavorite(product._id))
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Card
            containerStyle={{
                ...globalStyles.cardContainer,
                marginBottom: 5,
            }}>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('ProductDetail', {_id: product._id})
                }
                style={{flexDirection: 'row'}}>
                <Image
                    source={{uri: product.thumbnailImage}}
                    style={{
                        width: 100,
                        height: 80,
                    }}
                    resizeMethod="resize"
                    resizeMode="contain"
                />

                <View>
                    <Text
                        style={{
                            color: 'black',
                            fontSize: 18,
                            fontWeight: 'bold',
                        }}>
                        {product.productName}
                    </Text>
                    <Text
                        style={{
                            color: 'red',
                            fontSize: 16,
                        }}>
                        {Intl.NumberFormat('en-US').format(product.price)} đ
                    </Text>
                </View>
                <View style={{flex: 1}} />
                {type == 'cart' && (
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            marginRight: 5,
                        }}>
                        <Icon name="trash" color={'#FA8072'} size={24} />
                    </TouchableOpacity>
                )}
                {type == 'favorite' && (
                    <TouchableOpacity
                        onPress={handleRemoveFavoriteClick}
                        style={{
                            justifyContent: 'center',
                            marginRight: 5,
                        }}>
                        <Icon
                            name="heart"
                            color={'red'}
                            size={24}
                            solid={true}
                        />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        </Card>
    )
}

export default ProductItemHorizontal

const styles = StyleSheet.create({})
