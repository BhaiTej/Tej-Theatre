// src/redux/showsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const showsSlice = createSlice({
  name: 'shows',
  initialState: {
    shows: null,
  },
  reducers: {
    setShows: (state, action) => {
      state.shows = action.payload;
    },
  },
});

export const { setShows } = showsSlice.actions;
export default showsSlice.reducer;
