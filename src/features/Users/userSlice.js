import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        signIn: (state, action) => {
            return (state = action.payload)
        },

        signOut: state => {
            return (state = {})
        },

        updatePhoneNumber: (state, action) => {
            updatedUser = state
            updatedUser.phoneNumber = action.payload
            return updatedUser
        },

        updateAddress: (state, action) => {
            updatedUser = state
            updatedUser.address = action.payload
            return updatedUser
        },
    },
})

// Action creators are generated for each case reducer function
export const {updatePhoneNumber, signIn, signOut, updateAddress} =
    userSlice.actions

export default userSlice.reducer
