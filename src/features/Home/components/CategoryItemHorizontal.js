import React from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const CategoryItemHorizontal = ({category, navigation}) => {
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('UploadDetail', category)}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
            <Image
                source={{uri: category.image}}
                style={{
                    width: 80,
                    height: 60,
                    margin: 2,
                }}
                resizeMethod="resize"
                resizeMode="contain"
            />
            <Text
                style={{
                    color: 'black',
                    fontSize: 18,
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
