// import { combineReducers } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import standardSimilarityScoreReducer from "./standardSimilarityScoreReducer";
import highlightReducer from "./highlightReducer";
import classHighlightReducer from "./classHighlightReducer";
import matrixFilterReducer from "./matrixFilterReducer";

const rootReducer = combineReducers({
  highlight: highlightReducer,
  classHighLight: classHighlightReducer, // Header 하이라이트
  matrixFilter: matrixFilterReducer,
  standardSimilarityScoreReducer,
});
export default rootReducer;
