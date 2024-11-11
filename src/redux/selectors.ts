import { Store, CombinedState } from 'redux';
import { ChangeStandardSimilarityScoreAction } from './actions';
import { StandardSimilarityScoreState } from './reducers/standardSimilarityScoreReducer';

export const getStandardSimilarityScore = (
    store: Store<
        CombinedState<{
            standardSimilarityScoreReducer: StandardSimilarityScoreState;
        }>,
        ChangeStandardSimilarityScoreAction
    >
) => {
    return store.getState().standardSimilarityScoreReducer.standardSimilarityScore;
};
