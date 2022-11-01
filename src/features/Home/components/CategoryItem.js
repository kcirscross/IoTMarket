import React from 'react'
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {Card} from 'react-native-elements'
import {globalStyles} from '../../../assets/styles/globalStyles'

const CategoryItem = data => {
    const [{categoryName, image}] = data.data
    const index = data.data[1]

    const handleCategoryItemClick = () => {
        console.log('Click category: ', categoryName)
    }

    return (
        <Card
            containerStyle={{
                ...globalStyles.cardContainer,
                marginLeft:
                    data.data[2] > 4
                        ? index == Math.round(data.data[2] / 2) || index == 0
                            ? 0
                            : 5
                        : index == 0
                        ? 0
                        : 5,
                marginTop:
                    index >= Math.round(data.data[2] / 2) && data.data[2] > 4
                        ? 5
                        : 0,
            }}>
            <TouchableOpacity
                onPress={handleCategoryItemClick}
                style={styles.categoryItem}>
                <Image
                    source={{uri: image}}
                    style={{
                        width: 90,
                        height: 50,
                    }}
                    resizeMethod="scale"
                    resizeMode="contain"
                />
                <Text
                    style={{
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'center',
                        marginBottom: 5,
                    }}>
                    {categoryName}
                </Text>
            </TouchableOpacity>
        </Card>
    )
}

export default CategoryItem

const styles = StyleSheet.create({
    categoryItem: {
        flexDirection: 'column',
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
