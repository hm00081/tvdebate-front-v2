import {
  KeytermObject,
  UtteranceObject,
} from "./../../../interfaces/DebateDataInterface";
import _ from "lodash";
import * as math from "mathjs";
import { findTopValueIndexes } from "../../../common_functions/findTopValueIndexes";
import { SimilarityBlock } from "../interfaces";
import { TermCountDictOfEGMaker } from "../ConceptualMapModal/TermCountDictOfEGMaker";
import { ParticipantDict } from "../../../common_functions/makeParticipants";
import { TermType } from "../DataImporter";

export function extractKeytermsFromEngagementGroup(
  engagementGroup: SimilarityBlock[][],
  conceptMatrixTransposed: number[][],
  keytermObjects: KeytermObject[],
  numOfTop: number
): KeytermObject[] {
  // make sum of keytermScores
  let sumOfKeytermScores = math.zeros([
    conceptMatrixTransposed[0].length,
  ]) as number[];
  _.forEach(engagementGroup, (rowSimilarityBlocks) => {
    const utteranceIndex = rowSimilarityBlocks[0].rowUtteranceIndex - 1;
    const keytermScores = conceptMatrixTransposed[utteranceIndex];

    sumOfKeytermScores = math.add(
      sumOfKeytermScores,
      keytermScores
    ) as number[];
  });

  const topValueIndexes = findTopValueIndexes(sumOfKeytermScores, numOfTop);
  const highScoredKeytermObjects = _.map(
    topValueIndexes,
    (topValueIndex) => keytermObjects[topValueIndex]
  );

  return highScoredKeytermObjects;
}

export function extractFrequencyTermsFromEG(
  engagementGroup: SimilarityBlock[][],
  utteranceObjects: UtteranceObject[],
  participantDict: ParticipantDict,
  termType: TermType
): string[] {
  const utteranceObjectsOfEG = _.map(engagementGroup, (rowSimilarityBlocks) => {
    const utteranceIndex = rowSimilarityBlocks[0].rowUtteranceIndex - 1;
    return utteranceObjects[utteranceIndex];
  });

  const termCountDictOfEGMaker = new TermCountDictOfEGMaker(
    utteranceObjectsOfEG,
    participantDict,
    termType
  );

  const termCountDictOfEG = termCountDictOfEGMaker.getTermCountDictOfEG();

  const termCountObjectsOfEG = _.map(termCountDictOfEG, (count, term) => {
    return {
      term,
      count,
    };
  });
  const sortedTermCountObjectsOfEG = _.orderBy(
    termCountObjectsOfEG,
    (termCountObject) => termCountObject.count,
    ["desc"]
  );

  const highFrequencyTerms: string[] = [];
  const numOfFrequencyTerms =
    7 < sortedTermCountObjectsOfEG.length
      ? 7
      : sortedTermCountObjectsOfEG.length;
  for (let i = 0; i < numOfFrequencyTerms; i++) {
    highFrequencyTerms.push(sortedTermCountObjectsOfEG[i].term);
  }

  return highFrequencyTerms;
}

export function extractTermsFromEngagementGroup(
  engagementGroup: SimilarityBlock[][],
  termUtteranceBooleanMatrixTransposed: number[][],
  termList: string[]
): string[] {
  const standardHighCount: number = 0;

  const grouptermCountDict: { [term: string]: number } = {};
  _.forEach(engagementGroup, (verticalSimilarityBlocks, utteranceIndex) => {
    // find terms
    const termBooleans = termUtteranceBooleanMatrixTransposed[utteranceIndex];
    _.forEach(termBooleans, (termBoolean, termIndex) => {
      //
      if (termBoolean === 1) {
        const term = termList[termIndex];
        if (term in grouptermCountDict) {
          grouptermCountDict[term] += 1;
        } else {
          grouptermCountDict[term] = 1;
        }
      }
    });
  });
  // console.log("highScoredKeyTermDict", highScoredKeyTermDict);
  // console.log("grouptermCountDict", grouptermCountDict);
  const termsOfGroup: string[] = [];
  _.forEach(grouptermCountDict, (count, term) => {
    if (count > standardHighCount) termsOfGroup.push(term);
  });
  // console.log("termsOfGroup", termsOfGroup);
  return termsOfGroup.sort();
}
