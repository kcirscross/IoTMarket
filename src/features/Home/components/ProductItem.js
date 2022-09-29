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
    const {productImages, productTitle, productPrice, productID} = data

    const handleProductItemClick = () => {
        console.log('You click: ', productID)
    }

    return (
        <View
            style={{
                width: Dimensions.get('window').width * 0.473,
                padding: 5,
            }}>
            <Card containerStyle={globalStyles.cardContainer}>
                <TouchableOpacity onPress={handleProductItemClick}>
                    <Icon
                        name="camera"
                        size={24}
                        style={{
                            position: 'absolute',
                            top: 5,
                            left: 10,
                            zIndex: 1,
                        }}
                    />
                    <View>
                        <Image
                            source={productImages}
                            resizeMode="contain"
                            resizeMethod="resize"
                            style={{
                                width: '100%',
                                height: 140,
                                borderRadius: 10,
                                zIndex: 0,
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
                            {productTitle}
                        </Text>
                        <Text
                            style={{
                                color: 'red',
                            }}>
                            {parseInt(productPrice)} đ
                        </Text>
                    </View>
                </TouchableOpacity>
            </Card>
        </View>
    )
}

export default ProductItem

const styles = StyleSheet.create({})
