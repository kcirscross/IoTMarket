import React from 'react'
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { Card } from 'react-native-elements'
import { globalStyles } from '../../../assets/styles/globalStyles'

const ProductItem = ({ data, navigation }) => {
    const { price, productName, thumbnailImage, soldCount } = data

    return (
        <View
            style={{
                width: Dimensions.get('window').width * 0.473,
                padding: 2,
            }}>
            <Card containerStyle={globalStyles.cardContainer}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.push('ProductDetail', { _id: data._id })
                    }>
                    <Image
                        source={{ uri: thumbnailImage }}
                        resizeMode="contain"
                        resizeMethod="resize"
                        style={styles.imageStyle}
                    />

                    <View
                        style={{
                            paddingLeft: 10,
                        }}>
                        <Text
                            ellipsizeMode="tail"
                            numberOfLines={2}
                            style={{
                                fontWeight: '600',
                                color: 'black',
                                fontSize: 16,
                            }}>
                            {productName + `\n`}
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 5,
                            }}>
                            <Text
                                style={{
                                    color: 'blue',
                                    fontWeight: '500',
                                }}>
                                {Intl.NumberFormat('en-US').format(price)} đ
                            </Text>

                            <View style={{ flex: 1 }} />

                            <Text style={{ color: 'black' }}>
                                Sold:{' '}
                                {Intl.NumberFormat('en-US').format(soldCount)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Card>
        </View>
    )
}

export default ProductItem

const styles = StyleSheet.create({
    imageStyle: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#99999',
    },
})
