import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';

const initialState = {
  moviesList: {upcoming: [], popular: []} as Record<string, any[]>,
  movieDetails: [] as Record<string, any>[],
};

const movies = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    addMoviesList: (
      state,
      action: PayloadAction<{
        moviesList: [];
        category: string;
      }>,
    ) => {
      state.moviesList[action.payload.category] = _.uniqBy(
        [
          ...state.moviesList[action.payload.category],
          ...action.payload.moviesList,
        ],
        'id',
      );
    },
    addMovieDetails: (
      state,
      action: PayloadAction<{
        movieDetails: Record<string, any>;
      }>,
    ) => {
      state.movieDetails = _.uniqBy(
        [...state.movieDetails, action.payload.movieDetails],
        'id',
      );
    },
  },
});

export const {addMovieDetails, addMoviesList} = movies.actions;
export default movies.reducer;
