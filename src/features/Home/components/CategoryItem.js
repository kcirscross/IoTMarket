import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Card} from 'react-native-elements'
import {globalStyles} from '../../../assets/styles/globalStyles'

const CategoryItem = data => {
    const [{categoryName, categoryImage}] = data.data
    const index = data.data[1]

    const handleCategoryItemClick = () => {
        console.log('Click category: ', categoryName)
    }

    return (
        <Card
            containerStyle={{
                ...globalStyles.cardContainer,
                marginLeft:
                    index == Math.round(data.data[2] / 2) || index == 0 ? 0 : 5,
                marginTop: index >= Math.round(data.data[2] / 2) ? 5 : 0,
            }}>
            <TouchableOpacity
                onPress={handleCategoryItemClick}
                style={styles.categoryItem}>
                <Image
                    source={categoryImage}
                    style={{
                        width: 70,
                        height: 50,
                    }}
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
