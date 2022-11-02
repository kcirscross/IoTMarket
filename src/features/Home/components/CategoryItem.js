import React from 'react'
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {Card} from 'react-native-elements'
import {globalStyles} from '../../../assets/styles/globalStyles'

const CategoryItem = ({data, navigation}) => {
    const {categoryName, image, _id} = data[0]
    const index = data[1]

    return (
        <Card
            containerStyle={{
                ...globalStyles.cardContainer,
                marginLeft:
                    data[2] > 4
                        ? index == Math.round(data[2] / 2) || index == 0
                            ? 0
                            : 5
                        : index == 0
                        ? 0
                        : 5,
                marginTop:
                    index >= Math.round(data[2] / 2) && data[2] > 4 ? 5 : 0,
            }}>
            <TouchableOpacity
                style={styles.categoryItem}
                onPress={() =>
                    navigation.navigate('FilterByCategory', data[0])
                }>
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
