// reducers/highlightReducer.js
import { createSlice } from "@reduxjs/toolkit";

const highlightSlice = createSlice({
  name: "highlight",
  initialState: {
    highlightedGroup: null,
  },
  reducers: {
    setHighlightedGroup(state, action) {
      state.highlightedGroup = action.payload;
    },
    clearHighlightedGroup(state) {
      state.highlightedGroup = null;
    },
  },
});

export const { setHighlightedGroup, clearHighlightedGroup } =
  highlightSlice.actions;
export default highlightSlice.reducer;
