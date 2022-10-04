import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        signIn: (state, action) => {
            return (state = action.payload)
        },
        update: (state, action) => {
            state = action.payload
        },
        signOut: state => {
            return (state = {})
        },
    },
})

// Action creators are generated for each case reducer function
export const {update, signIn, signOut} = userSlice.actions

export default userSlice.reducer
