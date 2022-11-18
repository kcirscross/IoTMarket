import React, {useLayoutEffect} from 'react'
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {ReviewItemHorizontal} from '../components'

const AllReviewScreen = ({navigation, route}) => {
    const {listReview} = route.params

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'All Review',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView>
                {listReview.map((review, index) => (
                    <ReviewItemHorizontal
                        navigation={navigation}
                        review={review}
                        key={index}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default AllReviewScreen

const styles = StyleSheet.create({})
