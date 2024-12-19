import { createSlice } from "@reduxjs/toolkit";
const matrixFilterSlice = createSlice({
  name: "highlight",
  initialState: {
    filter: [0, 100],
  },
  reducers: {
    updateFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});
export const { updateFilter } = matrixFilterSlice.actions;
export default matrixFilterSlice.reducer;
