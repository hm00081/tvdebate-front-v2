import { combineReducers } from "@reduxjs/toolkit";
import standardSimilarityScoreReducer from "./standardSimilarityScoreReducer";
import highlightReducer from "./highlightReducer";
import matrixFilterReducer from "./matrixFilterReducer";
import similarityBlockSelectReducer from "./similarityBlockSelectReducer";

const rootReducer = combineReducers({
  highlight: highlightReducer,
  matrixFilter: matrixFilterReducer,
  similarityBlockSelect: similarityBlockSelectReducer,
  standardSimilarityScoreReducer,
});
export default rootReducer;
