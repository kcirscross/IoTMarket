import {createSlice} from '@reduxjs/toolkit'

export const favoriteSlice = createSlice({
    name: 'favorite',
    initialState: [],
    reducers: {
        getFavorite: (state, action) => {
            return (state = action.payload)
        },

        addFavorite: (state, action) => {
            newArray = state
            newArray.unshift(action.payload)
            return newArray
        },

        removeFavorite: (state, action) => {
            newArray = state.filter(item => item._id !== action.payload)
            return newArray
        },
    },
})

export const {getFavorite, addFavorite, removeFavorite} = favoriteSlice.actions

export default favoriteSlice.reducer
