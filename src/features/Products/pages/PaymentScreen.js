/* eslint-disable react-native/no-inline-styles */
import { Colors, Fonts, Gutters, Layout, globalStyles } from '@/assets/styles';
import { AppText } from '@/components/GlobalComponents';
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import Ion from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import ModalLoading from '~/components/utils/ModalLoading';
import { PRIMARY_COLOR } from '../../../components/constants';
import { postAPI } from '../../../components/utils/base_API';
import ModalDeliveryMethod from '../components/ModalDeliveryMethod';

const PaymentScreen = ({ navigation, route }) => {
  const currentUser = useSelector(state => state.user);

  const { product, quantity } = route.params;

  const [modalDeliveryVisible, setModalDeliveryVisible] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const isFocus = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Payment',
      headerStyle: { backgroundColor: PRIMARY_COLOR },
      headerTintColor: 'white',
      headerShown: true,
      headerBackTitleStyle: {
        color: 'white',
      },
    });
  }, []);

  //Get Delivery Fee
  useEffect(() => {
    if (product) {
      setModalLoading(true);

      postAPI({
        url: 'shipping/calculate',
        data: [{ productId: product._id, quantity: quantity }],
      })
        .then(res => {
          if (res && res?.status === 200) {
            setDeliveryFee(res.data.totalShippingFee);
            setModalLoading(false);
          } else {
            Alert.alert('Error', 'Please update your phone number and address');
            setModalLoading(false);
            setIsError(true);
          }
        })
        .catch(err => console.log('Get Delivery Fee: ', err));
    }
  }, [isFocus, product]);

  const handlePaymentClick = () => {
    if (Object.keys(currentUser.address).length !== 0) {
      if (deliveryMethod) {
        Alert.alert('Confirm Order', 'You will pay when receive product.', [
          {
            text: 'Yes',
            onPress: () => {
              setModalLoading(true);

              postAPI({
                url: 'user/buy',
                params: {
                  isCodQuery: true,
                },
                data: [
                  {
                    productId: product._id,
                    quantity: quantity,
                  },
                ],
              })
                .then(res => {
                  if (res.status === 200) {
                    setModalLoading(false);

                    navigation.replace('Order');
                  }
                })
                .catch(err => console.log('Payment: ', err));
            },
          },
          {
            text: 'Cancel',
          },
        ]);
      } else {
        setModalLoading(true);

        postAPI({
          url: 'user/buy',
          data: [{ productId: product._id, quantity: quantity }],
        })
          .then(res => {
            if (res.status === 200) {
              navigation.navigate('WebViewPayment', {
                url: res.data.vnpUrl,
              });
              setModalLoading(false);
            }
          })
          .catch(err => console.log('Payment: ', err));
      }
    } else {
      Toast.show({ text1: 'Please fill in your address.', type: 'error' });
    }
  };

  const handleCloseModalDeliveryMethod = () => {
    setModalDeliveryVisible(false);
  };

  return !modalLoading ? (
    <SafeAreaView style={globalStyles.container}>
      <Card
        containerStyle={{
          ...globalStyles.cardContainer,
          marginTop: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate('ChangeInfo')}>
          <View style={Layout.rowHCenter}>
            <Ion name="location-outline" color={PRIMARY_COLOR} size={30} />
            <AppText style={styles.titleStyle}>Address</AppText>
          </View>

          <View style={[Layout.rowHCenter, { marginLeft: 10 }]}>
            <AppText>{`${currentUser.fullName}  |  ${currentUser.phoneNumber}\n${currentUser.address.street},\n${currentUser.address.ward}, ${currentUser.address.district},\n${currentUser.address.city}.`}</AppText>
            <View style={Layout.fill} />
            <Ion
              name="chevron-forward-outline"
              size={24}
              color={Colors.black}
              style={Layout.selfCenter}
            />
          </View>
        </TouchableOpacity>
      </Card>

      <Card
        containerStyle={{
          ...globalStyles.cardContainer,
          marginTop: 12,
        }}
      >
        <View style={Layout.rowHCenter}>
          <Ion name="cart-outline" size={30} color={PRIMARY_COLOR} />
          <AppText style={styles.titleStyle}>Product List</AppText>
        </View>

        <View style={[Layout.rowHCenter, Gutters.tinyTMargin]}>
          <Image
            source={{ uri: product.thumbnailImage }}
            style={{
              width: 60,
              height: 80,
              borderRadius: 10,
            }}
            resizeMethod="resize"
            resizeMode="contain"
          />
          <View
            style={[
              Layout.fill,
              {
                marginHorizontal: 10,
              },
            ]}
          >
            <AppText>{product.productName}</AppText>
            <View style={Layout.fill} />
            <View style={Layout.rowHCenter}>
              <AppText>
                {Intl.NumberFormat('en-US').format(product.price)} đ
              </AppText>
              <View style={Layout.fill} />
              <AppText>x{quantity}</AppText>
            </View>
          </View>
        </View>
      </Card>

      <Card
        containerStyle={{
          ...globalStyles.cardContainer,
          marginTop: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => setModalDeliveryVisible(true)}
          style={{ marginHorizontal: 5 }}
        >
          <View style={Layout.rowHCenter}>
            <Material name="local-shipping" size={26} color={PRIMARY_COLOR} />
            <AppText style={styles.titleStyle}>Delivery Method</AppText>
          </View>

          <View style={Layout.rowHCenter}>
            <View>
              <AppText style={Fonts.textBold}>
                {deliveryMethod ? 'COD' : 'Giao Hang Nhanh'}
              </AppText>
              <AppText>
                {deliveryMethod
                  ? 'Delivery fee will up to you and seller.'
                  : `${Intl.NumberFormat('en-US').format(deliveryFee)} đ `}
              </AppText>
            </View>

            <View style={Layout.fill} />

            <Ion
              name="chevron-forward-outline"
              size={24}
              color={Colors.black}
              style={Layout.selfCenter}
            />
          </View>
        </TouchableOpacity>
      </Card>

      <Card
        containerStyle={{
          ...globalStyles.cardContainer,
          marginTop: 12,
        }}
      >
        <View style={Layout.rowHCenter}>
          <Ion name="reader-outline" size={30} color={PRIMARY_COLOR} />
          <AppText style={styles.titleStyle}>Order Detail</AppText>
        </View>

        <View
          style={[
            Layout.rowHCenter,
            {
              marginHorizontal: 5,
              marginTop: 5,
            },
          ]}
        >
          <AppText>Total price of products:</AppText>

          <View style={Layout.fill} />

          <AppText>
            {Intl.NumberFormat('en-US').format(product.price * quantity)} đ
          </AppText>
        </View>

        <View
          style={[
            Layout.rowHCenter,
            {
              marginHorizontal: 5,
            },
          ]}
        >
          <AppText>Total delivery fee:</AppText>

          <View style={Layout.fill} />

          <AppText>
            {!deliveryMethod
              ? Intl.NumberFormat('en-US').format(deliveryFee)
              : 0}{' '}
            đ
          </AppText>
        </View>

        <View
          style={[
            Layout.rowHCenter,
            {
              marginHorizontal: 5,
            },
          ]}
        >
          <AppText style={Fonts.textBold}>Total payment:</AppText>

          <View style={Layout.fill} />

          <AppText
            style={[
              Fonts.textBold,
              {
                color: PRIMARY_COLOR,
              },
            ]}
          >
            {!deliveryMethod
              ? Intl.NumberFormat('en-US').format(
                  product.price * quantity + deliveryFee,
                )
              : Intl.NumberFormat('en-US').format(
                  product.price * quantity,
                )}{' '}
            đ
          </AppText>
        </View>
      </Card>

      <View style={styles.paymentContainer}>
        <View style={Layout.fill} />

        <View
          style={{
            alignItems: 'flex-end',
            marginVertical: 10,
            marginRight: 10,
          }}
        >
          <AppText style={Fonts.textBold}>Total payment</AppText>

          <Text
            style={{
              color: PRIMARY_COLOR,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {!deliveryMethod
              ? Intl.NumberFormat('en-US').format(
                  product.price * quantity + deliveryFee,
                )
              : Intl.NumberFormat('en-US').format(
                  product.price * quantity,
                )}{' '}
            đ
          </Text>
        </View>

        <TouchableOpacity
          onPress={
            isError
              ? () => {
                  Alert.alert(
                    'Error',
                    'Please update your phone number and address',
                  );
                }
              : handlePaymentClick
          }
          style={styles.orderStyle}
        >
          <AppText style={globalStyles.textButton}>CHECKOUT</AppText>
        </TouchableOpacity>
      </View>

      <ModalLoading visible={modalLoading} />

      <ModalDeliveryMethod
        visible={modalDeliveryVisible}
        deliveryFee={deliveryFee}
        deliveryMethod={deliveryMethod}
        onDismiss={handleCloseModalDeliveryMethod}
        onChange={setDeliveryMethod}
      />
    </SafeAreaView>
  ) : (
    <View>
      <ModalLoading visible={modalLoading} />
    </View>
  );
};

export default memo(PaymentScreen);

const styles = StyleSheet.create({
  modalView: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },
  titleStyle: {
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  paymentContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '110%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  orderStyle: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
  },
});
