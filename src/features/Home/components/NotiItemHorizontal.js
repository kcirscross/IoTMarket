/* eslint-disable react-native/no-inline-styles */
import { Colors, FontSize, Fonts, Layout } from '@/assets/styles';
import { AppText } from '@/components/GlobalComponents';
import moment from 'moment';
import React, { memo } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-elements';
import Font5 from 'react-native-vector-icons/FontAwesome5';
import MateIcon from 'react-native-vector-icons/MaterialIcons';
import { globalStyles } from '../../../assets/styles/globalStyles';
import { postAPI } from '../../../components/utils/base_API';

const NotiItemHorizontal = ({ navigation, noti }) => {
  const handleNotiClick = () => {
    postAPI({ url: `noti/${noti._id}` })
      .then(res => {
        if (res.status === 200) {
          noti.route !== 'Store'
            ? navigation.navigate(noti.route)
            : Alert.alert(
                'Please restart application to update your store.',
                '',
                [
                  {
                    text: 'OK',
                    onPress: () =>
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Splash' }],
                      }),
                  },
                  {
                    text: 'Cancel',
                  },
                ],
              );
        }
      })
      .catch(err => console.log('Noti: ', err));
  };

  return (
    <Card
      containerStyle={{
        ...globalStyles.cardContainer,
        marginTop: 10,
        marginHorizontal: 10,
        backgroundColor: noti.isRead ? Colors.white : '#ECFFDC',
      }}
    >
      <TouchableOpacity style={Layout.row} onPress={handleNotiClick}>
        {noti.route === 'Order' ? (
          <Font5 name="money-check-alt" size={36} color="green" />
        ) : (
          <MateIcon name="storefront" size={36} color="#f7cd4d" />
        )}
        <View style={{ marginLeft: 10 }}>
          <AppText style={[Fonts.textBold, { fontSize: FontSize.regular }]}>
            {noti.title}
          </AppText>
          <AppText>{noti.body}</AppText>
          <AppText style={{ fontSize: 12 }}>
            {moment(noti.createdAt).format('hh:mm  DD - MM - YYYY')}
          </AppText>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

export default memo(NotiItemHorizontal);
