import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {useLayoutEffect} from 'react'
import {API_URL, PRIMARY_COLOR, TOKEN} from '../../../components/constants'
import DropDownPicker from 'react-native-dropdown-picker'
import {useState} from 'react'
import {SafeAreaView} from 'react-native'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {useEffect} from 'react'
import axios from 'axios'
import {Input} from 'react-native-elements'
import {TouchableOpacity} from 'react-native'
import {Alert} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {KeyboardAvoidingView} from 'react-native'
import {TouchableWithoutFeedback} from 'react-native'
import {Keyboard} from 'react-native'
import {updateAddress} from '../userSlice'
import {useDispatch} from 'react-redux'

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

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
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
            try {
                const token = await AsyncStorage.getItem('token')
                axios({
                    method: 'patch',
                    url: `${API_URL}/user/changeaddress`,
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                    data: {
                        street: chosenStreet,
                        ward: chosenWard,
                        district: chosenDistrict,
                        city: chosenCity,
                    },
                }).then(res => {
                    if (res.status == 200) {
                        const action = updateAddress(res.data.newAddress)
                        dispatch(action)

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
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{height: '100%', width: '100%'}}>
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
                            style={{marginTop: 5}}
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
                            style={{marginTop: 5}}
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
                            style={{marginTop: 5}}
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
})
