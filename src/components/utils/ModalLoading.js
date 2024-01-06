/* eslint-disable react-native/no-inline-styles */
import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { PRIMARY_COLOR } from '../constants';
import { AppText } from '../GlobalComponents';
import Modal from 'react-native-modal';
import { Colors, Layout } from '@/assets/styles';

const ModalLoading = ({ visible }) => {
  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
    >
      <View
        style={[
          Layout.center,
          Layout.selfCenter,
          Layout.regularBorderRadius,
          { width: 200, height: 200, backgroundColor: Colors.white },
        ]}
      >
        <ActivityIndicator size={'large'} color={PRIMARY_COLOR} />
        <AppText
          style={{
            color: PRIMARY_COLOR,
            fontWeight: '700',
            fontSize: 20,
            alignSelf: 'center',
            marginTop: 20,
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
  modal: { margin: 0 },
  modalStyle: {
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
});
