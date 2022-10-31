import {configureStore} from '@reduxjs/toolkit'
import userReducer from './src/features/Users/userSlice'
import favoriteReducer from './src/features/Products/favoriteSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        favorite: favoriteReducer,
    },
})
