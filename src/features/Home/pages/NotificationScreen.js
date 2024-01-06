/* eslint-disable react-native/no-inline-styles */
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import ModalLoading from '~/components/utils/ModalLoading';
import { globalStyles } from '../../../assets/styles/globalStyles';
import { PRIMARY_COLOR } from '../../../components/constants';
import { getAPI } from '../../../components/utils/base_API';
import NotiItemHorizontal from '../components/NotiItemHorizontal';
import { Layout } from '@/assets/styles';

const NotificationScreen = ({ navigation }) => {
  const [listNoti, setListNoti] = useState([]);
  const [modalLoading, setModalLoading] = useState(true);
  const isFocus = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Notification',
      headerStyle: { backgroundColor: PRIMARY_COLOR },
      headerTintColor: 'white',
      headerShown: true,
      headerBackTitleStyle: {
        color: 'white',
      },
    });
  }, []);

  useEffect(() => {
    setModalLoading(true);
    getAPI({ url: 'noti' })
      .then(res => {
        if (res.status === 200) {
          setListNoti(res.data.notifications);
          setModalLoading(false);
        }
      })
      .catch(err => console.log('Get Notification: ', err));
  }, [isFocus]);

  return (
    <SafeAreaView style={[globalStyles.container, { paddingHorizontal: 0 }]}>
      <ModalLoading visible={modalLoading} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          Layout.scroll,
          {
            paddingBottom: 10,
          },
        ]}
      >
        {listNoti.map((noti, index) => (
          <NotiItemHorizontal key={index} navigation={navigation} noti={noti} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(NotificationScreen);
