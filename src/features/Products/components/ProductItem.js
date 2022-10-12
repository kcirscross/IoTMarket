import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React from 'react'
import {Card} from 'react-native-elements'
import {globalStyles} from '../../../assets/styles/globalStyles'
import Icon from 'react-native-vector-icons/FontAwesome5'

const ProductItem = ({data, navigation}) => {
    const {price, productName, thumbnailImage} = data

    const handleProductItemClick = () => {
        navigation.navigate('ProductDetail', {data: data})
    }

    return (
        <View
            style={{
                width: Dimensions.get('window').width * 0.473,
                padding: 2,
            }}>
            <Card containerStyle={globalStyles.cardContainer}>
                <TouchableOpacity onPress={handleProductItemClick}>
                    <View>
                        <Image
                            source={{uri: thumbnailImage}}
                            resizeMode="contain"
                            resizeMethod="resize"
                            style={{
                                width: '100%',
                                height: 120,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: '#99999',
                            }}
                        />
                    </View>
                    <View
                        style={{
                            paddingLeft: 10,
                        }}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: 'black',
                            }}>
                            {productName}
                        </Text>
                        <Text
                            style={{
                                color: 'red',
                            }}>
                            {parseInt(price)} đ
                        </Text>
                    </View>
                </TouchableOpacity>
            </Card>
        </View>
    )
}

export default ProductItem

const styles = StyleSheet.create({})
