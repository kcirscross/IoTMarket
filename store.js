import {configureStore} from '@reduxjs/toolkit'
import userReducer from './src/features/Users/userSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
})
