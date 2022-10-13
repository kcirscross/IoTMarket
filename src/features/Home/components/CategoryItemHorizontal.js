import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Image} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const CategoryItemHorizontal = ({category}) => {
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
            <Image
                source={{uri: category.image}}
                style={{
                    width: 80,
                    height: 50,
                }}
                resizeMethod="scale"
                resizeMode="contain"
            />
            <Text
                style={{
                    color: 'black',
                    fontSize: 16,
                }}>
                {category.categoryName}
            </Text>
            <View style={{flex: 1}} />
            <Icon name="chevron-forward-outline" size={24} color="black" />
        </TouchableOpacity>
    )
}

export default CategoryItemHorizontal

const styles = StyleSheet.create({})
