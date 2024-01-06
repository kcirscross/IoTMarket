import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    signIn: (state, action) => {
      return (state = action.payload);
    },

    signOut: state => {
      return (state = {});
    },

    updatePhoneNumber: (state, action) => {
      let updatedUser = state;
      updatedUser.phoneNumber = action.payload;
      return updatedUser;
    },

    updateAddress: (state, action) => {
      let updatedUser = state;
      updatedUser.address = action.payload;
      return updatedUser;
    },

    updateGender: (state, action) => {
      let updatedUser = state;
      updatedUser.gender = action.payload;
      return updatedUser;
    },

    updateAvatar: (state, action) => {
      let updatedUser = state;
      updatedUser.avatar = action.payload;
      return updatedUser;
    },

    updateOnlineStatus: (state, action) => {
      let updatedUser = state;
      updatedUser.onlineStatus = action.payload;
      return updatedUser;
    },

    addFollow: (state, action) => {
      let updatedUser = state;
      updatedUser.follows.push(action.payload);
      return updatedUser;
    },

    removeFollow: (state, action) => {
      let updatedUser = state;
      const listFollow = updatedUser.follows;
      updatedUser.follows = listFollow.filter(id => id !== action.payload);
      return updatedUser;
    },

    addReview: (state, action) => {
      let updatedUser = state;
      updatedUser.isReview.push(action.payload);

      return updatedUser;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updatePhoneNumber,
  signIn,
  signOut,
  updateAddress,
  updateGender,
  updateAvatar,
  updateOnlineStatus,
  addFollow,
  removeFollow,
  addReview,
} = userSlice.actions;

export default userSlice.reducer;
