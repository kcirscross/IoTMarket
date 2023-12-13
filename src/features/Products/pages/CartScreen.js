import { Layout, globalStyles } from '@/assets/styles';
import { PRIMARY_COLOR } from '@/components/constants';
import { getAPI } from '@/components/utils/base_API';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { View } from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import ModalLoading from '~/components/utils/ModalLoading';
import ProductItemHorizontal from '../components/ProductItemHorizontal';
import { patchAPI } from '../../../components/utils/base_API';

const CartScreen = ({ navigation }) => {
  const [listProducts, setListProducts] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [listOrder, setListOrder] = useState([]);
  const isFocus = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'My Cart',
      headerStyle: { backgroundColor: PRIMARY_COLOR },
      headerTintColor: 'white',
      headerShown: true,
      headerBackTitleStyle: {
        color: 'white',
      },
    });
  }, []);

  //Get Cart
  useEffect(() => {
    setListOrder([]);
    setModalLoading(true);

    getAPI({ url: 'user/cart' })
      .then(res => {
        if (res.status === 200) {
          setListProducts(res.data.cart.content);
          setModalLoading(false);
        }
      })
      .catch(err => {
        setModalLoading(false);
        console.log('Get Cart: ', err);
      });
  }, [isFocus]);

  const getData = data => {
    data.action
      ? setListOrder([
          ...listOrder,
          { product: data.product, quantity: data.quantity },
        ])
      : setListOrder(prevState =>
          prevState.filter(product => product.product._id !== data.product._id),
        );
  };

  const handleClearAllClick = () => {
    let tempCartList = [];

    listProducts.map(product =>
      tempCartList.push({
        productId: product.productId._id,
        quantity: product.quantity,
      }),
    );

    Alert.alert('Confirm remove all cart.', 'Do you want to remove all cart?', [
      {
        text: 'Yes',
        onPress: () => {
          setModalLoading(true);
          patchAPI({
            url: 'user/removecart/',
            data: tempCartList,
          })
            .then(res => {
              if (res.status === 200) {
                setModalLoading(false);
                Toast.show({
                  text1: 'Removed all cart.',
                  type: 'success',
                });

                setListProducts([]);
              }
            })
            .catch(err => console.log('Delete all: ', err));
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ModalLoading visible={modalLoading} />

      {!modalLoading && listProducts.length === 0 && (
        <View style={styles.cartEmptyContainer}>
          <Image
            source={require('~/assets/images/notfound.png')}
            style={styles.imageEmpty}
          />
          <Text style={styles.messageEmpty}>Your cart is empty.</Text>
        </View>
      )}

      {listProducts.length > 0 && (
        <TouchableOpacity
          style={styles.touchStyle}
          onPress={handleClearAllClick}
        >
          <Text style={globalStyles.textButton}>Clear All</Text>
        </TouchableOpacity>
      )}

      <Toast position="bottom" bottomOffset={70} />

      {!modalLoading && (
        <View style={Layout.fill}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {listProducts.map((product, index) => (
              <ProductItemHorizontal
                key={index}
                product={product}
                navigation={navigation}
                type="cart"
                onPress={getData}
              />
            ))}
          </ScrollView>

          {listProducts.length > 0 && (
            <TouchableOpacity
              onPress={() =>
                listOrder.length > 0
                  ? navigation.navigate('PaymentCart', listOrder)
                  : Toast.show({
                      type: 'error',
                      text1: 'No item chosen.',
                    })
              }
              style={styles.orderButton}
            >
              <Text style={globalStyles.textButton}>Order</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    paddingTop: 5,
  },
  touchStyle: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    borderRadius: 10,
    marginBottom: 5,
  },
  cartEmptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: '50%',
  },
  imageEmpty: {
    width: 200,
    height: 200,
  },
  messageEmpty: {
    marginTop: 10,
    color: PRIMARY_COLOR,
    fontSize: 20,
    fontWeight: '700',
  },
  orderButton: {
    ...globalStyles.button,
    alignSelf: 'center',
    marginBottom: 10,
  },
});
