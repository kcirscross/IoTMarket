/* eslint-disable react-native/no-inline-styles */
import React, { memo } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { PRIMARY_COLOR } from '../constants';
import { AppText } from '../GlobalComponents';

const ModalLoading = ({ visible }) => {
  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent={true}
      style={styles.modalStyle}
    >
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
        }}
      >
        <ActivityIndicator
          style={{ marginTop: '40%' }}
          size={'large'}
          color={PRIMARY_COLOR}
        />
        <AppText
          style={{
            color: PRIMARY_COLOR,
            fontWeight: '700',
            fontSize: 18,
            alignSelf: 'center',
            marginVertical: 10,
          }}
        >
          Loading...
        </AppText>
      </View>
    </Modal>
  );
};

export default memo(ModalLoading);

const styles = StyleSheet.create({
  modalStyle: {
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
});
