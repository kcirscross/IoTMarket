/* eslint-disable react-native/no-inline-styles */
import { Colors, Gutters, Layout } from '@/assets/styles';
import { AppText } from '@/components/GlobalComponents';
import React, { Fragment, memo, useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ion from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import ModalLoading from '@/components/utils/ModalLoading';
import { patchAPI } from '@/components/utils/base_API';
import { updateGender } from '../userSlice';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';

const ModalChangeGender = ({ visible, onDismiss }) => {
  const { bottom } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user);

  const [modalLoading, setModalLoading] = useState(false);

  const changeGender = useCallback(gender => {
    //Validate Gender
    if (gender !== '') {
      setModalLoading(true);

      patchAPI({
        url: 'user/changegender',
        data: {
          gender: gender,
        },
      })
        .then(res => {
          if (res.status === 200) {
            setModalLoading(false);

            const action = updateGender(res.data.newGender);
            dispatch(action);

            onDismiss();

            Toast.show({
              type: 'success',
              text1: 'Update successfully.',
            });
          }
        })
        .catch(() => {
          onDismiss();

          Toast.show({
            type: 'error',
            text1: 'Update failed.',
          });
        });
    }
  }, []);

  return (
    <Fragment>
      <Modal
        style={styles.modal}
        isVisible={visible}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        onBackdropPress={onDismiss}
      >
        <View
          style={[
            Gutters.tinyTPadding,
            Gutters.smallBPadding,
            Gutters.smallHPadding,
            styles.modalView,
            { bottom: bottom },
          ]}
        >
          <View style={[Layout.rowHCenter, Layout.justifyContentBetween]}>
            <AppText
              style={{
                ...styles.labelStyle,
                fontSize: 18,
              }}
            >
              Choose your Gender
            </AppText>

            <TouchableOpacity onPress={onDismiss}>
              <Ion name="close-circle-outline" size={30} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              changeGender('Male');
            }}
            style={[
              Layout.rowHCenter,
              Gutters.smallTMargin,
              styles.touchModalView,
            ]}
          >
            {currentUser.gender === 'Male' ? (
              <Icon name="check-square" size={20} color={Colors.black} />
            ) : (
              <Icon name="square" size={20} color={Colors.black} />
            )}

            <AppText style={Gutters.tinyLMargin}>Male</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              changeGender('Female');
            }}
            style={[
              Layout.rowHCenter,
              Gutters.tinyTMargin,
              styles.touchModalView,
            ]}
          >
            {currentUser.gender === 'Female' ? (
              <Icon name="check-square" size={20} color="black" />
            ) : (
              <Icon name="square" size={20} color="black" />
            )}
            <AppText style={Gutters.tinyLMargin}>Female</AppText>
          </TouchableOpacity>
        </View>
      </Modal>

      <ModalLoading visible={modalLoading} />
    </Fragment>
  );
};

export default memo(ModalChangeGender);

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    width: '100%',
  },
  labelStyle: {
    color: Colors.black,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});
