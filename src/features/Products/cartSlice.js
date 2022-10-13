import AsyncStorage from '@react-native-async-storage/async-storage'
import {createSlice} from '@reduxjs/toolkit'
import axios from 'axios'
import {API_URL} from '../../components/constants'

export const cartSlice = createSlice({
    name: 'cart',
    initialState: [],
    reducers: {
        getCart: (state, action) => {
            return (state = action.payload)
        },
    },
})

export const {getCart} = cartSlice.actions

export default cartSlice.reducer
