// reducers/highlightReducer.js
import { createSlice } from "@reduxjs/toolkit";

const similarityBlockSelectSlice = createSlice({
  name: "similarityBlockSelect",
  initialState: {
    selectedBlock: [],
  },
  reducers: {
    setSelectedBlock(state, action) {
      state.selectedBlock = action.payload;
    },
    clearSelectedBlock(state) {
      state.selectedBlock = [];
    },
  },
});

export const { setSelectedBlock, clearSelectedBlock } =
similarityBlockSelectSlice.actions;
export default similarityBlockSelectSlice.reducer;
