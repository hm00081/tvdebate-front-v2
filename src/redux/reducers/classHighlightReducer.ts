import { createSlice } from "@reduxjs/toolkit";

const classHighlightSlice = createSlice({
  name: "classHighlight",
  initialState: {
    highlightedClassName: null,
  },
  reducers: {
    setHighlightedClass(state, action) {
      const { className } = action.payload || {};
      state.highlightedClassName = className || null;
    },
    clearHighlightedClass(state) {
      state.highlightedClassName = null;
    },
  },
});

export const { setHighlightedClass, clearHighlightedClass } =
  classHighlightSlice.actions;
export default classHighlightSlice.reducer;
