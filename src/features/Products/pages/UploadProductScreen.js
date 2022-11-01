import axios from 'axios'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import {CategoryItemHorizontal} from '../../Home/components'

const UploadProductScreen = ({navigation}) => {
    const [listCategories, setListCategories] = useState([])
    const [modalLoading, setModalLoading] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            headerStyle: {
                backgroundColor: PRIMARY_COLOR,
            },
            headerTitle: '',
        })
    }, [])

    useEffect(() => {
        setModalLoading(true)
        axios({
            method: 'get',
            url: `${API_URL}/category`,
        })
            .then(res => {
                if (res.status == 200) {
                    setListCategories(res.data.categories)
                    setModalLoading(false)
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
            <ModalLoading visible={modalLoading} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {listCategories.map((category, index) => (
                    <CategoryItemHorizontal
                        key={index}
                        category={category}
                        navigation={navigation}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default UploadProductScreen

const styles = StyleSheet.create({})
