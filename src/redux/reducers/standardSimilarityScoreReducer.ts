// /* eslint-disable no-unused-vars */
// import { CHANGE_STANDARD_SIMILARITY_SCORE } from "../actionTypes";
// import { Reducer } from "@reduxjs/toolkit";
// import { ChangeStandardSimilarityScoreAction } from "../actions";
// // import { maxSimilarityScore } from "../../views/ConceptualRecurrencePlot/DataStructureMaker";

// export interface StandardSimilarityScoreState {
//   standardSimilarityScore: number;
// }
// const initialState: StandardSimilarityScoreState = {
//   standardSimilarityScore: 100000,
// };

// const standardSimilarityScoreReducer: Reducer<
//   StandardSimilarityScoreState,
//   ChangeStandardSimilarityScoreAction
// > = (state = initialState, action: ChangeStandardSimilarityScoreAction) => {
//   switch (action.type) {
//     case CHANGE_STANDARD_SIMILARITY_SCORE: {
//       return {
//         ...state,
//         standardSimilarityScore: action.payload.standardSimilarityScore,
//       };
//     }
//     default:
//       return state;
//   }
// };

// export default standardSimilarityScoreReducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface StandardSimilarityScoreState {
  standardSimilarityScore: number;
}

const initialState: StandardSimilarityScoreState = {
  standardSimilarityScore: 100000,
};

const standardSimilarityScoreSlice = createSlice({
  name: "standardSimilarityScore",
  initialState,
  reducers: {
    changeStandardSimilarityScore(
      state,
      action: PayloadAction<{ standardSimilarityScore: number }>
    ) {
      state.standardSimilarityScore = action.payload.standardSimilarityScore;
    },
  },
});

export const { changeStandardSimilarityScore } =
  standardSimilarityScoreSlice.actions;
export default standardSimilarityScoreSlice.reducer;
