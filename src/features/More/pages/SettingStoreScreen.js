import AsyncStorage from '@react-native-async-storage/async-storage'
import {useIsFocused} from '@react-navigation/native'
import axios from 'axios'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {Switch} from 'react-native-elements'
import Toast from 'react-native-toast-message'
import Ion from 'react-native-vector-icons/Ionicons'
import {useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {
    API_URL,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
} from '../../../components/constants'

const SettingStoreScreen = ({navigation}) => {
    const [switchValue, setSwitchValue] = useState(true)
    const [modalActive, setModalActive] = useState(false)
    const currentUser = useSelector(state => state.user)
    const [storeInfo, setStoreInfo] = useState([])

    const isFocus = useIsFocused()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Setting My Store',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    const handleActiveClick = async () => {
        if (switchValue) {
            setSwitchValue(false)
            try {
                const token = await AsyncStorage.getItem('token')
                axios({
                    method: 'patch',
                    url: `${API_URL}/store/deactive`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => {
                        if (res.status == 200) {
                            setModalActive(false)
                            Toast.show({
                                type: 'success',
                                text1: 'Your store is deactived.',
                            })
                        }
                    })
                    .catch(error => {
                        setModalActive(false)
                        console.log(error.response.data)
                    })
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                const token = await AsyncStorage.getItem('token')
                axios({
                    method: 'patch',
                    url: `${API_URL}/store/active`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => {
                        if (res.status == 200) {
                            setModalActive(false)
                            Toast.show({
                                type: 'success',
                                text1: 'Your store is actived.',
                            })
                            setSwitchValue(true)
                        }
                    })
                    .catch(error => {
                        setModalActive(false)
                        console.log(error.response.data)
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        axios({
            method: 'get',
            url: `${API_URL}/store/${currentUser.storeId}`,
        })
            .then(res => {
                if (res.status == 200) {
                    res.data.store.status == 'Active'
                        ? setSwitchValue(true)
                        : setSwitchValue(false)

                    setStoreInfo(res.data.store)
                }
            })
            .catch(error => console.log(error.response))
    }, [isFocus])

    return (
        <SafeAreaView
            style={{...globalStyles.container, opacity: modalActive ? 0.3 : 1}}>
            <Modal
                transparent={true}
                visible={modalActive}
                animationType="fade">
                <SafeAreaView
                    style={{
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: '40%',
                        alignSelf: 'center',
                        padding: 10,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: SECONDARY_COLOR,
                    }}>
                    <Text style={{color: 'black'}}>
                        {switchValue
                            ? `Your customer cannot buy your product when you deactive.
                        Are you sure to continue?`
                            : `Your store will be active.`}
                    </Text>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            paddingVertical: 10,
                        }}>
                        <TouchableOpacity
                            onPress={() => setModalActive(false)}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                borderRightColor: 'black',
                                borderRightWidth: 1,
                            }}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleActiveClick}
                            style={{flex: 1, alignItems: 'center'}}>
                            <Text
                                style={{
                                    ...styles.textStyle,
                                    color: switchValue ? 'red' : PRIMARY_COLOR,
                                }}>
                                {switchValue ? 'Deactive' : 'Active'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>

            <Toast position="bottom" bottomOffset={70} />

            <TouchableOpacity
                onPress={() => navigation.navigate('UpdateStore', storeInfo)}
                style={{...styles.touchStyle, marginTop: 10}}>
                <Text style={styles.textStyle}>Store Profile</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setModalActive(true)}
                style={styles.touchStyle}>
                <Text style={styles.textStyle}>Active</Text>
                <View style={{flex: 1}} />
                <Switch
                    value={switchValue}
                    onTouchStart={() => setModalActive(true)}
                    color={PRIMARY_COLOR}
                />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default SettingStoreScreen

const styles = StyleSheet.create({
    touchStyle: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textStyle: {
        color: 'black',
        fontSize: 16,
    },
})
