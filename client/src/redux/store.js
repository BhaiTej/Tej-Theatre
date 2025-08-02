import { configureStore } from '@reduxjs/toolkit';
import loadersReducer from './loadersSlice';
import usersReducer from './usersSlice';
import showsReducer from './showsSlice';
import moviesReducer from './movieSlice'; // ⬅ import movies slice

const store = configureStore({
  reducer: {
    loaders: loadersReducer,
    users: usersReducer,
    shows: showsReducer,
    movies: moviesReducer, // ⬅ register movies slice
  },
});

export default store;
