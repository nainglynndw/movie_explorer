import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  favouriteList: [] as number[],
};

const favourite = createSlice({
  name: 'favourite',
  initialState,
  reducers: {
    addFavourite: (
      state,
      action: PayloadAction<{
        favourite: number;
      }>,
    ) => {
      state.favouriteList = [...state.favouriteList, action.payload.favourite];
    },
    removeFavourite: (
      state,
      action: PayloadAction<{
        favourite: number;
      }>,
    ) => {
      state.favouriteList = state.favouriteList.filter(
        fav => fav !== action.payload.favourite,
      );
    },
  },
});

export const {addFavourite, removeFavourite} = favourite.actions;
export default favourite.reducer;
