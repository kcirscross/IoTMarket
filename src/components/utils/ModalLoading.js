import React from 'react'
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native'
import {PRIMARY_COLOR} from '../constants'

const ModalLoading = ({visible}) => {
    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
            style={styles.modalStyle}>
            <View
                style={{
                    position: 'absolute',
                    top: '40%',
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    width: 200,
                    height: 200,
                    borderRadius: 10,
                    alignItems: 'center',
                }}>
                <ActivityIndicator
                    style={{marginTop: '40%'}}
                    size={'large'}
                    color={PRIMARY_COLOR}
                />
                <Text
                    style={{
                        color: PRIMARY_COLOR,
                        fontWeight: '700',
                        fontSize: 18,
                        alignSelf: 'center',
                        marginVertical: 10,
                    }}>
                    Loading...
                </Text>
            </View>
        </Modal>
    )
}

export default ModalLoading

const styles = StyleSheet.create({
    modalStyle: {
        alignSelf: 'center',
        width: 100,
        height: 100,
    },
})
