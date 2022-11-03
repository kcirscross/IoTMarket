import axios from 'axios'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import {Input} from 'react-native-elements'
import {useDispatch} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../../../components/constants'
import {patchAPI} from '../../../components/utils/base_API'
import {updateAddress} from '../userSlice'

const ChangeAddressScreen = ({navigation, route}) => {
    const [openCity, setOpenCity] = useState(false)
    const [valueCity, setValueCity] = useState(null)
    const [itemsCity, setItemsCity] = useState([])

    const [openDistrict, setOpenDistrict] = useState(false)
    const [valueDistrict, setValueDistrict] = useState(null)
    const [itemsDistrict, setItemsDistrict] = useState([])

    const [openWard, setOpenWard] = useState(false)
    const [valueWard, setValueWard] = useState(null)
    const [itemsWard, setItemsWard] = useState([])

    const [chosenCity, setChosenCity] = useState('')
    const [chosenDistrict, setChosenDistrict] = useState('')
    const [chosenWard, setChosenWard] = useState('')
    const [chosenStreet, setChosenStreet] = useState('')

    const existAddress = route.params
    const dispatch = useDispatch()

    const [modalLoading, setModalLoading] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Change Address',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    const getCity = async () => {
        let list = []
        await axios({
            method: 'get',
            url: 'https://provinces.open-api.vn/api/p/',
        })
            .then(res => {
                if (res.status == 200) {
                    res.data.forEach(city =>
                        list.push({
                            label: city.name,
                            value: city.code,
                        }),
                    )
                    setItemsCity(list)
                }
            })
            .catch(err => console.log(err))
    }

    const getDistrict = async code => {
        let list = []
        await axios({
            method: 'get',
            url: `https://provinces.open-api.vn/api/p/${code}`,
            params: {
                depth: 2,
            },
        })
            .then(res => {
                if (res.status == 200) {
                    res.data.districts.forEach(districts =>
                        list.push({
                            label: districts.name,
                            value: districts.code,
                        }),
                    )
                    setItemsDistrict(list)
                }
            })
            .catch(err => console.log(err))
    }

    const getWard = async code => {
        let list = []
        await axios({
            method: 'get',
            url: `https://provinces.open-api.vn/api/d/${code}`,
            params: {
                depth: 2,
            },
        })
            .then(res => {
                if (res.status == 200) {
                    res.data.wards.forEach(wards =>
                        list.push({
                            label: wards.name,
                            value: wards.code,
                        }),
                    )
                    setItemsWard(list)
                }
            })
            .catch(err => console.log(err))
    }

    //Init value if exist address
    useEffect(() => {
        if (existAddress != undefined) {
            setChosenCity(existAddress.city)
            setChosenDistrict(existAddress.district)
            setChosenWard(existAddress.ward)
            setChosenStreet(existAddress.street)
        }
    }, [])

    useEffect(() => {
        getCity()
    }, [])

    const handleUpdateAddressClick = async () => {
        //Validate
        if (
            chosenStreet == '' ||
            chosenWard == '' ||
            chosenDistrict == '' ||
            chosenCity == ''
        ) {
            Alert.alert('Please fill in all field.')
        } else {
            setModalLoading(true)

            patchAPI({
                url: 'user/changeaddress',
                data: {
                    street: chosenStreet,
                    ward: chosenWard,
                    district: chosenDistrict,
                    city: chosenCity,
                },
            }).then(res => {
                if (res.status === 200) {
                    setModalLoading(false)

                    dispatch(updateAddress(res.data.newAddress))

                    Alert.alert('Update successfully.', '', [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigation.goBack()
                            },
                        },
                    ])
                }
            })
        }
    }

    return (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                opacity: modalLoading ? 0.5 : 1,
            }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{height: '100%', width: '100%'}}>
                    <ModalLoading visible={modalLoading} />
                    <View
                        style={{
                            marginTop: 10,
                        }}>
                        <Text style={styles.textStyle}>Choose your city.</Text>
                        <DropDownPicker
                            open={openCity}
                            value={valueCity}
                            items={itemsCity}
                            placeholder={
                                existAddress != undefined
                                    ? existAddress.city
                                    : 'Select your city.'
                            }
                            labelStyle={{
                                color: 'black',
                            }}
                            setOpen={setOpenCity}
                            setValue={setValueCity}
                            setItems={setItemsCity}
                            onSelectItem={item => {
                                getDistrict(item.value)
                                setChosenCity(item.label)
                            }}
                            style={styles.dropStyle}
                            zIndex={3}
                        />
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}>
                        <Text style={styles.textStyle}>
                            Choose your district.
                        </Text>
                        <DropDownPicker
                            open={openDistrict}
                            value={valueDistrict}
                            items={itemsDistrict}
                            placeholder={
                                existAddress != undefined
                                    ? existAddress.district
                                    : 'Select your district.'
                            }
                            labelStyle={{
                                color: 'black',
                            }}
                            setOpen={setOpenDistrict}
                            setValue={setValueDistrict}
                            setItems={setItemsDistrict}
                            onSelectItem={item => {
                                getWard(item.value)
                                setChosenDistrict(item.label)
                            }}
                            style={styles.dropStyle}
                            zIndex={2}
                        />
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}>
                        <Text style={styles.textStyle}>Choose your ward.</Text>
                        <DropDownPicker
                            open={openWard}
                            value={valueWard}
                            items={itemsWard}
                            labelStyle={{
                                color: 'black',
                            }}
                            placeholder={
                                existAddress != undefined
                                    ? existAddress.ward
                                    : 'Select your ward.'
                            }
                            setOpen={setOpenWard}
                            setValue={setValueWard}
                            setItems={setItemsWard}
                            style={styles.dropStyle}
                            zIndex={1}
                            onSelectItem={item => setChosenWard(item.label)}
                        />
                    </View>
                    <View>
                        <Text style={styles.textStyle}>
                            Please fill in your detail address.
                        </Text>
                        <Input
                            placeholder="Your detail address."
                            containerStyle={{
                                width: '100%',
                                paddingHorizontal: 0,
                            }}
                            defaultValue={chosenStreet}
                            inputContainerStyle={{
                                borderBottomWidth: 0,
                                backgroundColor: SECONDARY_COLOR,
                                padding: 5,
                                borderRadius: 10,
                            }}
                            inputStyle={{
                                padding: 0,
                                fontSize: 16,
                                ...styles.textStyle,
                            }}
                            renderErrorMessage={false}
                            onChangeText={text => setChosenStreet(text)}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleUpdateAddressClick}
                        style={{
                            ...globalStyles.button,
                            position: 'absolute',
                            bottom: 10,
                            alignSelf: 'center',
                        }}>
                        <Text style={globalStyles.textButton}>Update</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default ChangeAddressScreen

const styles = StyleSheet.create({
    textStyle: {
        color: 'black',
    },
    dropStyle: {marginTop: 5, backgroundColor: SECONDARY_COLOR},
})
