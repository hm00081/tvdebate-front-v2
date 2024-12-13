import { combineReducers } from "@reduxjs/toolkit";
import standardSimilarityScoreReducer from "./standardSimilarityScoreReducer";
import highlightReducer from "./highlightReducer";
import matrixFilterReducer from "./matrixFilterReducer";

const rootReducer = combineReducers({
  highlight: highlightReducer,
  matrixFilter: matrixFilterReducer,
  standardSimilarityScoreReducer,
});
export default rootReducer;
