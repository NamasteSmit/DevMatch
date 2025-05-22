import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    feed: [],
    currentIndex: 0,
  },
  reducers: {
    addToFeed: (state, action) => {
      state.feed = action.payload;
      state.currentIndex = 0;
    },
    nextProfile: (state, action) => {
      if (state.currentIndex < state.feed.length - 1) {
        state.currentIndex += 1;
      } else {
        state.currentIndex = 0;
      }
    },
    removeFromFeed: (state, action) => {
      state.feed = state.feed.filter((item) => item._id !== action.payload);
      if (state.currentIndex >= state.feed.length) {
        state.currentIndex = 0;
      }
    },
  },
});

export default feedSlice.reducer;

export const { addToFeed, nextProfile, removeFromFeed } = feedSlice.actions;
