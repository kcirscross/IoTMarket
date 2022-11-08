import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../../../components/constants'
import ModalChooseQuantity from './ModalChooseQuantity'

const BottomMenuBar = ({navigation, productOwner, product, onPress}) => {
    const [modalBuy, setModalBuy] = useState(false)

    const handleCallClick = () => {
        Linking.openURL(`tel:${productOwner.phoneNumber}`)
    }

    const handleSmsClick = () => {
        Linking.openURL(`sms:${productOwner.phoneNumber}`)
    }

    const setModalVisible = isVisible => {
        onPress(isVisible)
        setModalBuy(isVisible)
    }

    return (
        <View
            style={{
                position: 'absolute',
                bottom: 0,
                height: 50,
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                borderTopEndRadius: 10,
                borderTopLeftRadius: 10,
                borderTopColor: 'white',
                borderTopWidth: 3,
                backgroundColor: 'white',
            }}>
            <TouchableOpacity
                onPress={handleCallClick}
                style={{
                    flexDirection: 'row',
                    width: '25%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Icon name="phone-alt" size={24} color={PRIMARY_COLOR} />
                <Text
                    style={{
                        color: PRIMARY_COLOR,
                        marginLeft: 5,
                        fontWeight: 'bold',
                    }}>
                    Call
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSmsClick}
                style={{
                    flexDirection: 'row',
                    width: '30%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Icon name="sms" size={24} color={PRIMARY_COLOR} />
                <Text
                    style={{
                        color: PRIMARY_COLOR,
                        marginLeft: 5,
                        fontWeight: 'bold',
                    }}>
                    SMS
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    width: '25%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Icon
                    name="comment-alt"
                    size={24}
                    color={PRIMARY_COLOR}
                    solid={true}
                />
                <Text
                    style={{
                        color: PRIMARY_COLOR,
                        marginLeft: 5,
                        fontWeight: 'bold',
                    }}>
                    Chat
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setModalBuy(true)
                    onPress(true)
                }}
                style={{
                    flexDirection: 'row',
                    width: '25%',
                    backgroundColor: PRIMARY_COLOR,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopEndRadius: 10,
                }}>
                <Text
                    style={{
                        color: 'white',
                        marginLeft: 5,
                        fontWeight: 'bold',
                        borderTopEndRadius: 10,
                    }}>
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
    )
}

export default BottomMenuBar

const styles = StyleSheet.create({})
