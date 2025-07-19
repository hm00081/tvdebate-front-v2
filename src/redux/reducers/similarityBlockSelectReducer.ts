// reducers/highlightReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SelectedBlock = [[string, string], [number, number]] | [];

interface SimilarityBlockSelectState {
  selectedBlock: SelectedBlock;
}

// 초기 상태
const initialState: SimilarityBlockSelectState = {
  selectedBlock: [],
};

const similarityBlockSelectSlice = createSlice({
  name: "similarityBlockSelect",
  initialState,
  reducers: {
    setSelectedBlock(state, action: PayloadAction<SelectedBlock>) {
      state.selectedBlock = action.payload;
    },
    clearSelectedBlock(state) {
      state.selectedBlock = [];
    },
  },
});

export const { setSelectedBlock, clearSelectedBlock } = similarityBlockSelectSlice.actions;
export default similarityBlockSelectSlice.reducer;
