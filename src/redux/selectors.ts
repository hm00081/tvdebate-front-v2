// import { Store, CombinedState } from 'redux';
// import { ChangeStandardSimilarityScoreAction } from './actions';
// import { StandardSimilarityScoreState } from './reducers/standardSimilarityScoreReducer';

// export const getStandardSimilarityScore = (
//     store: Store<
//         CombinedState<{
//             standardSimilarityScoreReducer: StandardSimilarityScoreState;
//         }>,
//         ChangeStandardSimilarityScoreAction
//     >
// ) => {
//     return store.getState().standardSimilarityScoreReducer.standardSimilarityScore;
// };

import { Store } from "redux";
import { StandardSimilarityScoreState } from "./reducers/standardSimilarityScoreReducer";
import { ChangeStandardSimilarityScoreAction } from "./actions";

export interface RootState {
  standardSimilarityScoreReducer: StandardSimilarityScoreState;
}

export const getStandardSimilarityScore = (
  store: Store<RootState, ChangeStandardSimilarityScoreAction>
) => {
  return store.getState().standardSimilarityScoreReducer
    .standardSimilarityScore;
};
