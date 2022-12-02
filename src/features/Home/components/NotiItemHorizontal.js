import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import React from 'react'
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Card} from 'react-native-elements'
import Font5 from 'react-native-vector-icons/FontAwesome5'
import MateIcon from 'react-native-vector-icons/MaterialIcons'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {postAPI} from '../../../components/utils/base_API'

const NotiItemHorizontal = ({navigation, noti}) => {
    const handleNotiClick = () => {
        postAPI({url: `noti/${noti._id}`})
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
                                              routes: [{name: 'Splash'}],
                                          }),
                                  },
                                  {
                                      text: 'Cancel',
                                  },
                              ],
                          )
                }
            })
            .catch(err => console.log('Noti: ', err))
    }

    return (
        <Card
            containerStyle={{
                ...globalStyles.cardContainer,
                marginTop: 5,
                backgroundColor: noti.isRead ? 'white' : '#ECFFDC',
            }}>
            <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={handleNotiClick}>
                {noti.route === 'Order' ? (
                    <Font5 name="money-check-alt" size={36} color="green" />
                ) : (
                    <MateIcon name="storefront" size={36} color="#f7cd4d" />
                )}
                <View style={{marginLeft: 10}}>
                    <Text
                        style={{
                            color: 'black',
                            fontWeight: '600',
                            fontSize: 16,
                        }}>
                        {noti.title}
                    </Text>
                    <Text style={{color: 'black'}}>{noti.body}</Text>
                    <Text style={{color: 'black', fontSize: 12}}>
                        {moment(noti.createdAt).format('hh:mm  DD - MM - YYYY')}
                    </Text>
                </View>
            </TouchableOpacity>
        </Card>
    )
}

export default NotiItemHorizontal

const styles = StyleSheet.create({})
