/* eslint-disable react-native/no-inline-styles */
import { Layout, globalStyles } from '@/assets/styles';
import { AlertForSignIn, SECONDARY_COLOR } from '@/components/constants';
import React, { memo, useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native-animatable';
import Ion from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const ModalChooseQuantity = ({
  navigation,
  visible,
  productOwner,
  product,
  onPress,
}) => {
  const [quantity, setQuantity] = useState(1);

  const currentUser = useSelector(state => state.user);

  useEffect(() => {
    if (quantity < 1) {
      onPress(false);
      setQuantity(1);
    }
  }, [quantity]);

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalView}>
        <View style={styles.viewContainer}>
          <Image
            source={{ uri: product.thumbnailImage }}
            style={styles.imageStyle}
            resizeMethod="resize"
            resizeMode="contain"
          />

          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: 'blue' }}>
              {Intl.NumberFormat('en-US').format(product.price * quantity)} đ
            </Text>

            <View style={styles.quantityStyle}>
              <TouchableOpacity
                style={styles.touchStyle}
                onPress={() => setQuantity(quantity - 1)}
              >
                <Ion name="remove" size={16} color="black" />
              </TouchableOpacity>

              <Text style={{ color: 'black', marginHorizontal: 10 }}>
                {quantity.toString()}
              </Text>

              <TouchableOpacity
                disabled={quantity === product.numberInStock}
                onPress={() => setQuantity(quantity + 1)}
                style={styles.touchStyle}
              >
                <Ion name="add" size={16} color="black" />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: 'black',
                marginTop: 30,
              }}
            >
              Stock: {product.numberInStock}
            </Text>
          </View>

          <View style={Layout.fill} />

          <TouchableOpacity
            onPress={() => setQuantity(0)}
            style={styles.closeStyle}
          >
            <Ion name="close-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (Object.keys(currentUser).length !== 0) {
              navigation.navigate('Payment', {
                product,
                productOwner,
                quantity,
              });
              setQuantity(0);
            } else {
              AlertForSignIn({ navigation });
            }
          }}
          style={[
            globalStyles.button,
            Layout.selfCenter,
            {
              marginBottom: 20,
            },
          ]}
        >
          <Text style={globalStyles.textButton}>ORDER</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default memo(ModalChooseQuantity);

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },

  imageStyle: {
    width: 120,
    height: 150,
    borderRadius: 10,
    borderColor: SECONDARY_COLOR,
    borderWidth: 1,
  },

  viewContainer: { flexDirection: 'row', marginTop: 10, alignItems: 'center' },

  touchStyle: {
    borderColor: SECONDARY_COLOR,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  quantityStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  closeStyle: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
