import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  userData: null,
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<{
        userData: any;
      }>,
    ) => {
      state.userData = action.payload.userData;
    },
  },
});

export const {setUserData} = user.actions;
export default user.reducer;
