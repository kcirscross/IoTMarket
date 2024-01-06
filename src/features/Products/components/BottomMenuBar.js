/* eslint-disable react-native/no-inline-styles */
import { Layout } from '@/assets/styles';
import { PRIMARY_COLOR } from '@/components/constants';
import React, { memo, useState } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ModalChooseQuantity from './ModalChooseQuantity';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomMenuBar = ({ navigation, productOwner, product, onPress }) => {
  const { bottom } = useSafeAreaInsets();

  const [modalBuy, setModalBuy] = useState(false);

  const handleCallClick = () => {
    Linking.openURL(`tel:${productOwner.phoneNumber}`);
  };

  const handleSmsClick = () => {
    Linking.openURL(`sms:${productOwner.phoneNumber}`);
  };

  const setModalVisible = isVisible => {
    onPress(isVisible);
    setModalBuy(isVisible);
  };

  return (
    <View
      style={[
        Layout.absolute,
        Layout.rowCenter,
        Layout.regularDropShadow,
        {
          bottom: bottom,
          height: 50,
          width: '105%',
          borderTopEndRadius: 10,
          borderTopLeftRadius: 10,
          borderTopColor: 'white',
          borderTopWidth: 3,
          backgroundColor: 'white',
        },
      ]}
    >
      <TouchableOpacity
        onPress={handleCallClick}
        style={[Layout.rowCenter, Layout.fill, Layout.fullHeight]}
      >
        <Icon name="phone-alt" size={24} color={PRIMARY_COLOR} />
        <Text
          style={{
            color: PRIMARY_COLOR,
            marginLeft: 5,
            fontWeight: 'bold',
          }}
        >
          CALL
        </Text>
      </TouchableOpacity>

      <Divider
        width={1}
        color={PRIMARY_COLOR}
        orientation="vertical"
        style={{ marginVertical: 10 }}
      />

      <TouchableOpacity
        onPress={handleSmsClick}
        style={[Layout.rowCenter, Layout.fill, Layout.fullHeight]}
      >
        <Icon name="sms" size={24} color={PRIMARY_COLOR} />
        <Text
          style={{
            color: PRIMARY_COLOR,
            marginLeft: 5,
            fontWeight: 'bold',
          }}
        >
          SMS
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setModalBuy(true);
          onPress(true);
        }}
        style={[
          Layout.rowCenter,
          Layout.fill,
          Layout.fullHeight,
          {
            backgroundColor: PRIMARY_COLOR,
            borderTopEndRadius: 10,
          },
        ]}
      >
        <Text
          style={{
            color: 'white',
            marginLeft: 5,
            fontWeight: 'bold',
            borderTopEndRadius: 10,
          }}
        >
          BUY NOW
        </Text>
      </TouchableOpacity>

      <ModalChooseQuantity
        navigation={navigation}
        visible={modalBuy}
        productOwner={productOwner}
        product={product}
        onPress={setModalVisible}
      />
    </View>
  );
};

export default memo(BottomMenuBar);
