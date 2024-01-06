/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import { Colors, Gutters, Layout } from '@/assets/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { memo, useLayoutEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import ModalLoading from '~/components/utils/ModalLoading';
import { globalStyles } from '../../../assets/styles/globalStyles';
import { PRIMARY_COLOR } from '../../../components/constants';
import { patchAPI, postAPI } from '../../../components/utils/base_API';
import { signOut } from '../userSlice';

const ChangePasswordScreen = ({ navigation }) => {
  const currentUser = useSelector(state => state.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Change Password',
      headerStyle: { backgroundColor: PRIMARY_COLOR },
      headerTintColor: 'white',
      headerShown: true,
      headerBackTitleStyle: {
        color: 'white',
      },
    });
  }, []);

  const deleteRememberAccount = () => {
    patchAPI({
      url: 'user/changeonlinestatus',
      data: { status: 'Offline' },
    }).then(async res => {
      if (res.status === 200) {
        await AsyncStorage.removeItem('account');
        await AsyncStorage.removeItem('password');
        await AsyncStorage.removeItem('accountType');
        await AsyncStorage.removeItem('token');
      }
    });
    //   .catch(err => console.log('Logout: ', err));
  };

  const changePassword = async () => {
    //Validate Password
    if (currentPassword === '' || newPassword === '' || reNewPassword === '') {
      Toast.show({
        type: 'error',
        text1: 'All field are required',
      });
    } else if (newPassword !== reNewPassword) {
      Toast.show({
        type: 'error',
        text1: 'Your confirm password is not match.',
      });
    } else {
      setModalLoading(true);

      patchAPI({
        url: 'user/changepassword',
        data: {
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
      })
        .then(res => {
          if (res && res.status === 200) {
            setModalLoading(false);

            Alert.alert(
              'Update password successfully. Please sign in again.',
              '',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    postAPI({
                      url: 'auth/logout',
                      data: {
                        email: currentUser.email,
                      },
                    })
                      .then(res => {
                        res.status === 200 && dispatch(signOut());
                        deleteRememberAccount();
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'Splash' }],
                        });
                      })
                      .catch(err => console.log('Logout: ', err));
                  },
                },
              ],
            );
          } else {
            setModalLoading(false);
            Alert.alert('Update password failed', 'Please try again');
          }
        })
        .catch(() => setModalLoading(false));
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, { paddingHorizontal: 0 }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={[Layout.scroll, Gutters.tinyHPadding]}
      >
        <Input
          containerStyle={styles.textContainer}
          label="Current Password"
          placeholder="Current Password"
          onChangeText={setCurrentPassword}
          labelStyle={styles.labelStyle}
          secureTextEntry={!visiblePassword}
          inputContainerStyle={styles.inputContainer}
          renderErrorMessage={false}
          rightIcon={
            <TouchableOpacity
              onPress={() => setVisiblePassword(!visiblePassword)}
            >
              {!visiblePassword ? (
                <Icon name="eye-slash" size={20} />
              ) : (
                <Icon name="eye" size={20} />
              )}
            </TouchableOpacity>
          }
        />

        <Input
          containerStyle={styles.textContainer}
          label="New Password"
          placeholder="New Password"
          onChangeText={setNewPassword}
          secureTextEntry={!visiblePassword}
          labelStyle={styles.labelStyle}
          inputContainerStyle={styles.inputContainer}
          renderErrorMessage={false}
          rightIcon={
            <TouchableOpacity
              onPress={() => setVisiblePassword(!visiblePassword)}
            >
              {!visiblePassword ? (
                <Icon name="eye-slash" size={20} />
              ) : (
                <Icon name="eye" size={20} />
              )}
            </TouchableOpacity>
          }
        />
        <Input
          containerStyle={styles.textContainer}
          label="Confirm New Password"
          placeholder="Confirm New Password"
          onChangeText={setReNewPassword}
          labelStyle={styles.labelStyle}
          secureTextEntry={!visiblePassword}
          inputContainerStyle={styles.inputContainer}
          renderErrorMessage={false}
          rightIcon={
            <TouchableOpacity
              onPress={() => setVisiblePassword(!visiblePassword)}
            >
              {!visiblePassword ? (
                <Icon name="eye-slash" size={20} />
              ) : (
                <Icon name="eye" size={20} />
              )}
            </TouchableOpacity>
          }
        />

        <View style={Layout.fill} />

        <TouchableOpacity
          onPress={changePassword}
          style={[Layout.selfCenter, Gutters.smallBMargin, globalStyles.button]}
        >
          <Text style={globalStyles.textButton}>Update Password</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <ModalLoading visible={modalLoading} />
    </SafeAreaView>
  );
};

export default memo(ChangePasswordScreen);

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 10,
    paddingHorizontal: 0,
  },
  labelStyle: {
    color: Colors.black,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  inputContainer: {
    ...globalStyles.input,
    width: '100%',
    marginTop: 0,
    borderBottomWidth: 0,
    paddingVertical: 5,
  },
});
