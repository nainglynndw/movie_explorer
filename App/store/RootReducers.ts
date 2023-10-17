import {combineReducers} from '@reduxjs/toolkit';
import FavouriteSlice from './Favourites/FavouriteSlice';
import MovieSlice from './Movie/MovieSlice';
import UserSlice from './User/UserSlice';

const rootReducers = combineReducers({
  user: UserSlice,
  movies: MovieSlice,
  favourite: FavouriteSlice,
});
export default rootReducers;
