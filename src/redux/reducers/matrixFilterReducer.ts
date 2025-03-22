import { createSlice } from "@reduxjs/toolkit";
const matrixFilterSlice = createSlice({
  name: "matrixFilter",
  initialState: {
    filter: [0, 100],
  },
  reducers: {
    updateFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearFilter: (state) => {
      state.filter = [0, 100];
    },
  },
});
export const { updateFilter, clearFilter } = matrixFilterSlice.actions;
export default matrixFilterSlice.reducer;
