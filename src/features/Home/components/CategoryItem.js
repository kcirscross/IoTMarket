import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Card} from 'react-native-elements'
import {globalStyles} from '../../../assets/styles/globalStyles'

const CategoryItem = data => {
    const [{categoryName, categoryImage}] = data.data
    const index = data.data[data.data.length - 1]

    const handleCategoryItemClick = () => {
        console.log('Click category: ', categoryName)
    }

    return (
        <Card
            containerStyle={{
                ...globalStyles.cardContainer,
                marginLeft: index == 0 ? 0 : 5,
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
    cardContainer: {
        margin: 0,
        padding: 0,
    },

    categoryItem: {
        flexDirection: 'column',
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
