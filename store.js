import {configureStore} from '@reduxjs/toolkit'
import userReducer from './src/features/Users/userSlice'
import cartReducer from './src/features/Products/cartSlice'
import favoriteReducer from './src/features/Products/favoriteSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        favorite: favoriteReducer,
    },
})
