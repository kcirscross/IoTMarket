/* eslint-disable react-native/no-inline-styles */
import { Colors, Gutters, Layout } from '@/assets/styles';
import { AppText } from '@/components/GlobalComponents';
import React, { memo, useCallback, useLayoutEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import ModalLoading from '~/components/utils/ModalLoading';
import { globalStyles } from '../../../assets/styles/globalStyles';
import {
  AVATAR_BORDER,
  PRIMARY_COLOR,
  REGEX_PHONE_NUMBER,
} from '../../../components/constants';
import { patchAPI } from '../../../components/utils/base_API';
import AvatarPickerBottomSheet from '../components/AvatarPickerBottomSheet';
import ModalChangeGender from '../components/ModalChangeGender';
import { updatePhoneNumber } from '../userSlice';

const ChangeInfoScreen = ({ navigation }) => {
  const currentUser = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber);
  const [modalGenderVisible, setModalGenderVisible] = useState(false);
  const [modalAvatarVisible, setModalAvatarVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const { street, ward, district, city } = currentUser.address || '';

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'My Information',
      headerStyle: { backgroundColor: PRIMARY_COLOR },
      headerTintColor: Colors.white,
      headerShown: true,
      headerBackTitleStyle: {
        color: Colors.white,
      },
    });
  }, []);

  const updatePhone = useCallback(() => {
    setModalLoading(true);

    patchAPI({
      url: 'user/changephone',
      data: {
        phoneNumber: phoneNumber,
      },
    })
      .then(res => {
        if (res.status === 200) {
          setModalLoading(false);

          const action = updatePhoneNumber(res.data.newPhoneNumber);
          dispatch(action);

          Toast.show({
            type: 'success',
            text1: 'Your phone number is updated.',
          });
        }
      })
      .catch(err => {
        setModalLoading(false);
        console.log('Update Phone: ', err);
      });
  }, [phoneNumber]);

  const handleChangePhoneNumberClick = useCallback(() => {
    //Validate Phone Number
    if (phoneNumber === '' || !REGEX_PHONE_NUMBER.test(phoneNumber)) {
      return Alert.alert('Phone number is invalid.');
    } else {
      updatePhone();
    }
  }, [phoneNumber]);

  const handleClosePicker = () => {
    setModalAvatarVisible(false);
  };

  const handleCloseModalChangeGender = () => {
    setModalGenderVisible(false);
  };

  return (
    <SafeAreaView
      style={{
        ...globalStyles.container,
        paddingHorizontal: 0,
      }}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        contentContainerStyle={[Layout.scroll, Gutters.tinyHPadding]}
      >
        <View
          style={[
            Layout.rowCenter,
            {
              marginTop: 10,
            },
          ]}
        >
          <TouchableOpacity onPress={() => setModalAvatarVisible(true)}>
            <Avatar
              rounded
              source={{
                uri: currentUser.avatar,
              }}
              size={80}
              avatarStyle={{
                borderWidth: 1,
                borderColor: AVATAR_BORDER,
              }}
            />

            <Icon
              name="camera"
              size={20}
              color={Colors.black}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 5,
              }}
            />
          </TouchableOpacity>

          <View
            style={{
              marginLeft: 10,
              flex: 1,
            }}
          >
            <Input
              placeholder="Full Name"
              containerStyle={styles.textContainer}
              defaultValue={currentUser.fullName}
              label="Full Name"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.inputContainer}
              renderErrorMessage={false}
              editable={false}
            />
          </View>
        </View>

        <Input
          placeholder="Phone Number"
          containerStyle={styles.textContainer}
          defaultValue={currentUser.phoneNumber}
          label="Phone Number"
          labelStyle={styles.labelStyle}
          inputContainerStyle={styles.inputContainer}
          keyboardType={'phone-pad'}
          renderErrorMessage={!REGEX_PHONE_NUMBER.test(phoneNumber)}
          errorMessage={
            phoneNumber === ''
              ? 'This field is required.'
              : 'The Phone Number is invalid.'
          }
          errorStyle={{
            display: !REGEX_PHONE_NUMBER.test(phoneNumber) ? 'flex' : 'none',
          }}
          onChangeText={text => setPhoneNumber(text)}
          rightIcon={
            phoneNumber === currentUser.phoneNumber ? (
              <Icon name="pen" size={20} color={Colors.black} />
            ) : (
              <TouchableOpacity
                onPress={handleChangePhoneNumberClick}
                style={{
                  ...globalStyles.button,
                  width: 60,
                  height: 35,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 0,
                }}
              >
                <AppText style={styles.textButton}>SAVE</AppText>
              </TouchableOpacity>
            )
          }
        />

        <Pressable
          onPress={() =>
            navigation.navigate('ChangeAddress', currentUser.address)
          }
        >
          <Input
            containerStyle={styles.textContainer}
            defaultValue={
              currentUser.address?.city === '' ?? ''
                ? ''
                : `${street},\n${ward},\n${district},\n${city}.`
            }
            label="Address"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainer}
            multiline={true}
            renderErrorMessage={false}
            editable={false}
            rightIcon={<Icon name="pen" size={20} color={Colors.black} />}
          />
        </Pressable>

        <Pressable
          onPress={() => {
            setModalGenderVisible(true);
          }}
        >
          <Input
            containerStyle={styles.textContainer}
            label="Gender"
            defaultValue={currentUser.gender}
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainer}
            renderErrorMessage={false}
            editable={false}
            rightIcon={<Icon name="pen" size={20} color={Colors.black} />}
          />
        </Pressable>

        <Pressable
          onPress={() => {
            currentUser.fromGoogle
              ? Alert.alert(
                  'Cannot change password',
                  'Because you are signing in with Google account.',
                )
              : navigation.navigate('ChangePassword');
          }}
        >
          <Input
            containerStyle={styles.textContainer}
            label="Change Password"
            labelStyle={styles.labelStyle}
            defaultValue={'********'}
            inputContainerStyle={styles.inputContainer}
            renderErrorMessage={false}
            editable={false}
            rightIcon={<Icon name="pen" size={20} color={Colors.black} />}
          />
        </Pressable>
      </KeyboardAwareScrollView>

      {modalAvatarVisible && (
        <AvatarPickerBottomSheet onDismiss={handleClosePicker} />
      )}

      <ModalChangeGender
        visible={modalGenderVisible}
        onDismiss={handleCloseModalChangeGender}
      />

      <ModalLoading visible={modalLoading} />
    </SafeAreaView>
  );
};

export default memo(ChangeInfoScreen);

const styles = StyleSheet.create({
  labelStyle: {
    color: Colors.black,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  textButton: {
    color: 'white',
    fontSize: 16,
  },

  inputContainer: {
    ...globalStyles.input,
    width: '100%',
    marginTop: 0,
    borderBottomWidth: 0,
    paddingVertical: 5,
  },
  textContainer: {
    marginTop: 10,
    paddingHorizontal: 0,
  },
  modalView: {
    backgroundColor: 'white',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  touchModalView: {
    alignItems: 'center',
  },
});
