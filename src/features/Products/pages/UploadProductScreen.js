import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import {useLayoutEffect} from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
import axios from 'axios'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {ScrollView} from 'react-native'
import {TouchableOpacity} from 'react-native'
import {CategoryItemHorizontal} from '../../Home/components'

const UploadProductScreen = ({navigation}) => {
    const [listCategories, setListCategories] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerStyle: {
                backgroundColor: PRIMARY_COLOR,
            },
            headerTitle: '',
        })
    }, [])

    useEffect(() => {
        axios({
            method: 'get',
            url: `${API_URL}/category`,
        })
            .then(res => {
                if (res.status == 200) {
                    setListCategories(res.data.categories)
                }
            })
            .catch(error => console.log(error))
    }, [])
    return (
        <SafeAreaView style={globalStyles.container}>
            <Text
                style={{
                    color: 'black',
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    fontSize: 20,
                }}>
                Choose Category
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {listCategories.map((category, index) => (
                    <CategoryItemHorizontal key={index} category={category} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default UploadProductScreen

const styles = StyleSheet.create({})
