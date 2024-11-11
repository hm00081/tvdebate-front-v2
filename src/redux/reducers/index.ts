import { combineReducers } from "redux";
import standardSimilarityScoreReducer from "./standardSimilarityScoreReducer";

const combinedReducers = combineReducers({
  standardSimilarityScoreReducer,
});
export default combinedReducers;
