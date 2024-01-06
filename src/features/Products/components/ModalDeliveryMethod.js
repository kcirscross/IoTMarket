/* eslint-disable react-native/no-inline-styles */
import { Layout } from '@/assets/styles';
import { PRIMARY_COLOR } from '@/components/constants';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Modal from 'react-native-modal';
import Ion from 'react-native-vector-icons/Ionicons';

const ModalDeliveryMethod = ({
  visible,
  deliveryFee,
  deliveryMethod,
  onDismiss,
  onChange,
}) => {
  return (
    <Modal
      style={styles.modal}
      isVisible={visible}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      onBackdropPress={onDismiss}
    >
      <View style={styles.modalView}>
        <View
          style={[
            Layout.row,
            {
              marginHorizontal: 5,
              marginTop: 5,
            },
          ]}
        >
          <Text
            style={{
              color: 'black',
              fontWeight: '600',
              fontSize: 16,
            }}
          >
            Choose delivery method
          </Text>

          <View style={Layout.fill} />

          <TouchableOpacity onPress={onDismiss}>
            <Ion name="close-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            onChange(false);
            onDismiss();
          }}
          style={[
            Layout.rowHCenter,
            {
              marginHorizontal: 10,
              marginBottom: 10,
            },
          ]}
        >
          <View>
            <Text style={{ color: 'black' }}>Giao Hang Nhanh</Text>

            <View style={Layout.rowHCenter}>
              <Text style={{ color: 'black' }}>Delivery fee:</Text>
              <Text style={{ color: 'black' }}>
                {` ${Intl.NumberFormat('en-US').format(deliveryFee)} đ`}
              </Text>
            </View>
          </View>

          <View style={Layout.fill} />

          {!deliveryMethod && (
            <Ion name="checkmark" color={PRIMARY_COLOR} size={24} />
          )}
        </TouchableOpacity>

        <Divider color={PRIMARY_COLOR} width={3} />

        <TouchableOpacity
          onPress={() => {
            onChange(true);
            onDismiss();
          }}
          style={[
            Layout.rowHCenter,
            {
              margin: 10,
            },
          ]}
        >
          <View>
            <Text style={{ color: 'black' }}>COD</Text>

            <Text style={{ color: 'black' }}>
              Delivery fee will up to you and seller.
            </Text>
          </View>

          <View style={Layout.fill} />

          {deliveryMethod && (
            <Ion name="checkmark" color={PRIMARY_COLOR} size={24} />
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default memo(ModalDeliveryMethod);

const styles = StyleSheet.create({
  modal: { margin: 0 },
  modalView: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },
});
