import React, {useState} from 'react'
import {View} from 'react-native'
import {Image, StyleSheet, TouchableOpacity} from 'react-native'
import Ion from 'react-native-vector-icons/Ionicons'

const UploadImageItem = props => {
    let deleteImage = () => {
        props.onPress(props.imageURI)
    }

    return (
        <View style={styles.container} key={props.imageURI}>
            <Image
                source={{uri: props.imageURI}}
                style={{
                    width: 150,
                    height: 120,
                    borderRadius: 10,
                }}
            />
            <TouchableOpacity onPress={deleteImage}>
                <Ion
                    name="close-circle"
                    size={24}
                    color="black"
                    style={{
                        right: 25,
                    }}
                />
            </TouchableOpacity>
        </View>
    )
}

export default UploadImageItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: 150,
        marginRight: 10,
    },
})
