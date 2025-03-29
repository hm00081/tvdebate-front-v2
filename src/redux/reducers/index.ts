// import { combineReducers } from "@reduxjs/toolkit";
import { combineReducers } from 'redux';
import standardSimilarityScoreReducer from './standardSimilarityScoreReducer';
import highlightReducer from './highlightReducer';
import classHighlightReducer from './classHighlightReducer';
import matrixFilterReducer from './matrixFilterReducer';
import similarityBlockSelectReducer from './similarityBlockSelectReducer';
import highlightTextReducer from './highlightTextReducer';

const rootReducer = combineReducers({
    highlight: highlightReducer,
    classHighLight: classHighlightReducer,
    matrixFilter: matrixFilterReducer,
    similarityBlockSelect: similarityBlockSelectReducer,
    standardSimilarityScoreReducer,
    hightlightText: highlightTextReducer,
});
export default rootReducer;
