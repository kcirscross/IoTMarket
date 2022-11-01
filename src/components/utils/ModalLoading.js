import React from 'react'
import {ActivityIndicator, Modal, StyleSheet} from 'react-native'
import {PRIMARY_COLOR} from '../constants'

const ModalLoading = ({visible}) => {
    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
            style={styles.modalStyle}>
            <ActivityIndicator
                style={{
                    backgroundColor: 'white',
                    width: 200,
                    height: 200,
                    borderRadius: 10,
                    position: 'absolute',
                    top: '40%',
                    alignSelf: 'center',
                }}
                size={'large'}
                color={PRIMARY_COLOR}
            />
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
