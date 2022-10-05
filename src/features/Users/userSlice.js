import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        signIn: (state, action) => {
            return (state = action.payload)
        },
        updatePhoneNumber: (state, action) => {
            newUser = state
            newUser.phoneNumber = action.payload
            return newUser
        },
        signOut: state => {
            return (state = {})
        },
    },
})

// Action creators are generated for each case reducer function
export const {updatePhoneNumber, signIn, signOut} = userSlice.actions

export default userSlice.reducer
