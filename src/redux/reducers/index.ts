// import { combineReducers } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import standardSimilarityScoreReducer from "./standardSimilarityScoreReducer";
import highlightReducer from "./highlightReducer";

const rootReducer = combineReducers({
  highlight: highlightReducer,
  standardSimilarityScoreReducer,
});
export default rootReducer;
