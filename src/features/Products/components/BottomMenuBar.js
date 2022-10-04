import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {PRIMARY_COLOR} from '../../../components/constants'

const BottomMenuBar = () => {
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
            }}>
            <TouchableOpacity
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
        </View>
    )
}

export default BottomMenuBar

const styles = StyleSheet.create({})
