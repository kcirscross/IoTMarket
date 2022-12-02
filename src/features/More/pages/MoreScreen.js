import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {useLayoutEffect, useState} from 'react'
import {
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {Avatar, Divider} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Ion from 'react-native-vector-icons/Ionicons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {useDispatch, useSelector} from 'react-redux'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {patchAPI, postAPI} from '../../../components/utils/base_API'
import {signOut} from '../../Users/userSlice'

const MoreScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()

    const [modalLoading, setModalLoading] = useState(false)

    const deleteRememberAccount = async () => {
        patchAPI({
            url: 'user/changeonlinestatus',
            data: {status: 'Offline'},
        })
            .then(async res => {
                if (res.status === 200) {
                    const account = await AsyncStorage.removeItem('account')
                    const password = await AsyncStorage.removeItem('password')
                    const accountType = await AsyncStorage.removeItem(
                        'accountType',
                    )
                    await AsyncStorage.removeItem('token')

                    if (
                        account === null &&
                        password === null &&
                        accountType === null
                    ) {
                        navigation.reset({
                            index: 0,
                            routes: [{name: 'Splash'}],
                        })
                    }
                }
            })
            .catch(err => console.log('Logout: ', err))
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: Object.keys(currentUser).length === 0,
            headerStyle: {
                backgroundColor: PRIMARY_COLOR,
            },
            headerTitle: Object.keys(currentUser).length !== 0 ? '' : 'Setting',
        })
    }, [])

    const handleSignOutClick = () => {
        Alert.alert('Confirm Sign Out?', '', [
            {
                text: 'Yes',
                onPress: () => {
                    setModalLoading(true)
                    postAPI({
                        url: 'auth/logout',
                        data: {email: currentUser.email},
                    })
                        .then(async res => {
                            if (res.status === 200) {
                                const action = signOut()
                                res.status == 200 && dispatch(action)

                                await deleteRememberAccount()

                                setModalLoading(false)
                            }
                        })
                        .catch(err => console.log('Logout: ', err))
                },
            },

            {
                text: 'Cancel',
            },
        ])
    }

    return Object.keys(currentUser).length !== 0 ? (
        <SafeAreaView style={globalStyles.container}>
            <ModalLoading visible={modalLoading} />

            <TouchableOpacity
                onPress={() => navigation.navigate('ChangeInfo')}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                }}>
                <Avatar
                    rounded
                    size={64}
                    source={{uri: currentUser.avatar}}
                    avatarStyle={{
                        borderWidth: 1,
                        borderColor: 'gray',
                    }}
                />
                <View
                    style={{
                        marginLeft: 10,
                    }}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: 'black',
                        }}>
                        {currentUser.fullName || ''}
                    </Text>
                    <Text>
                        Following:{' '}
                        {currentUser.follows != undefined
                            ? currentUser.follows.length
                            : 0}
                    </Text>
                </View>
            </TouchableOpacity>

            <Divider width={1} color={PRIMARY_COLOR} style={{marginTop: 10}} />

            <TouchableOpacity
                onPress={() => navigation.navigate('Store')}
                style={styles.container}>
                <MaterialIcon name="storefront" size={28} color="#f7cd4d" />
                <Text style={styles.textStyle}>My Store</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Following')}
                style={styles.container}>
                <Ion name="people-outline" size={28} color={'blue'} />
                <Text style={styles.textStyle}>Following</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Order', {from: 'buyer'})}
                style={styles.container}>
                <Image
                    source={require('~/assets/images/buy.png')}
                    style={{
                        tintColor: 'red',
                    }}
                />
                <Text style={styles.textStyle}>My Order</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.container}
                onPress={() => navigation.navigate('Cart')}>
                <Ion name="cart-outline" size={25} color={PRIMARY_COLOR} />
                <Text style={styles.textStyle}>My Cart</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.container}
                onPress={() => navigation.navigate('Favorite')}>
                <Icon name="heart" color={'#FF4122'} solid={true} size={24} />
                <Text style={styles.textStyle}>Favorite Products</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('ChangeInfo')}
                style={styles.container}>
                <Icon
                    name="info-circle"
                    color={'#45B8FE'}
                    solid={true}
                    size={24}
                />
                <Text style={styles.textStyle}>Change Your Infomation</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSignOutClick}
                style={styles.container}>
                <Icon
                    name="sign-out-alt"
                    color={'black'}
                    solid={true}
                    size={24}
                />
                <Text style={styles.textStyle}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    ) : (
        <SafeAreaView style={globalStyles.container}>
            <TouchableOpacity
                onPress={() => navigation.replace('SignIn')}
                style={{
                    ...globalStyles.button,
                    alignSelf: 'center',
                    marginTop: '100%',
                }}>
                <Text style={globalStyles.textButton}>Go to Sign In</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default MoreScreen

const styles = StyleSheet.create({
    textStyle: {
        color: 'black',
        fontSize: 16,
        marginLeft: 10,
    },

    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
})
