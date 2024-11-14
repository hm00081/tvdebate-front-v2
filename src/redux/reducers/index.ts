import { combineReducers } from "@reduxjs/toolkit";
import standardSimilarityScoreReducer from "./standardSimilarityScoreReducer";

const combinedReducers = combineReducers({
  standardSimilarityScoreReducer,
});
export default combinedReducers;
