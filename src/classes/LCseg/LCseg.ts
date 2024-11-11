/**
 * LCseg Model for Evaluation
 */

/* eslint-disable no-unused-vars */

import _ from "lodash";
import { findTopValueIndexes } from "../../common_functions/findTopValueIndexes";
import {
  SentenceObject,
  UtteranceObject,
} from "../../interfaces/DebateDataInterface";

export interface LexicalChain {
  term: string;
  sentenceIndexes: number[];
}

export interface TermLexicalChainDict {
  [term: string]: LexicalChain;
}

export interface SentenceIndexLexicalChainsDict {
  [sentenceIndex: number]: TermLexicalChainDict;
}

export default class LCseg {
  private segmentationProbabilities: number[] = [];
  private readonly totalSentenceObjects: SentenceObject[] = [];
  private sentenceIndexUtteranceIndexDict: {
    [sentenceIndex: number]: number;
  } = {};

  constructor(
    termList: string[],
    private readonly frequencyVector: number[],
    private readonly utteranceObjects: UtteranceObject[],
    private readonly sentenceIndexLexicalChainsDict: SentenceIndexLexicalChainsDict
  ) {
    // make sentenceIndex_utteranceIndex_dict;
    _.forEach(utteranceObjects, (utteranceObject, utteranceIndex) => {
      _.forEach(
        utteranceObject.sentenceObjects,
        (sentenceObject, sentenceIndex) => {
          this.totalSentenceObjects.push(sentenceObject);
          this.sentenceIndexUtteranceIndexDict[
            this.totalSentenceObjects.length - 1
          ] = utteranceIndex;
        }
      );
    });

    // make probabilities from start until end sentence index
    for (let i = 2; i < this.totalSentenceObjects.length - 2; i++) {
      this.segmentationProbabilities.push(
        this.makeSegmentationProability(i, termList)
      );
    }
    console.log(
      "this.segmentationProbabilities",
      this.segmentationProbabilities
    );
  }

  public makeSegmentSentenceIndexes(numOfSegments: number) {
    console.log("numOfSegments", numOfSegments);
    // find top probabilities in segmentationProbabilities
    let segmentSentenceIndexes: number[] = findTopValueIndexes(
      this.segmentationProbabilities,
      numOfSegments - 1
    );

    segmentSentenceIndexes = _.orderBy(segmentSentenceIndexes, [], "asc");

    // segmentSentenceIndexes.unshift(0);
    segmentSentenceIndexes.push(this.totalSentenceObjects.length - 1);

    return segmentSentenceIndexes;
  }

  // public makeGroupsInCRP(
  //   totalSimilarityBlockGroup: SimilarityBlock[][],
  //   segmentSentenceIndexes: number[]
  // ): SimilarityBlock[][][] {
  //   // find utteranceIndexes by segmentSentenceIndexes
  //   const segmentUtteranceIndexes: number[] = [];
  //   _.forEach(segmentSentenceIndexes, (sentenceIndex) => {
  //     const segmentUtteranceIndex = this.sentenceIndexUtteranceIndexDict[
  //       sentenceIndex
  //     ];

  //     // if (segmentUtteranceIndex < this.utteranceObjects.length - 1) {
  //     segmentUtteranceIndexes.push(segmentUtteranceIndex);
  //     // } else {
  //     //   segmentUtteranceIndexes.push(segmentUtteranceIndex - 1);
  //     // }
  //   });
  //   console.log("segmentUtteranceIndexes", segmentUtteranceIndexes);
  //   segmentUtteranceIndexes.push(this.utteranceObjects.length);

  //   // split groups by segmentUtteranceIndexes
  //   const segmentGroups: SimilarityBlock[][][] = [];
  //   for (let i = 0; i < segmentUtteranceIndexes.length - 1; i++) {
  //     if (
  //       segmentUtteranceIndexes[i] !== segmentUtteranceIndexes[i + 1] &&
  //       segmentUtteranceIndexes[i] < this.utteranceObjects.length - 1
  //     ) {
  //       const segmentGroup = make1EngagementGroup(
  //         totalSimilarityBlockGroup,
  //         segmentUtteranceIndexes[i],
  //         segmentUtteranceIndexes[i + 1]
  //       );
  //       segmentGroups.push(segmentGroup);
  //     }
  //   }

  //   return segmentGroups;
  // }

  private lexicalCohesionFunction(
    sentenceIndicesOfWindowA: number[],
    sentenceIndicesOfWindowB: number[],
    termList: string[]
  ): number {
    // collect each lexical_chains of A, B
    const termLexicalChainDictOfA: TermLexicalChainDict = makeCombinedTermLexicalChainDict(
      sentenceIndicesOfWindowA,
      this.sentenceIndexLexicalChainsDict
    );
    const termLexicalChainDictOfB: TermLexicalChainDict = makeCombinedTermLexicalChainDict(
      sentenceIndicesOfWindowB,
      this.sentenceIndexLexicalChainsDict
    );

    // make cosine(A, B)
    let numerator = 0;
    _.forEach(termList, (term, termIndex) => {
      numerator +=
        wTermAndWindow.call(this, term, termIndex, termLexicalChainDictOfA) *
        wTermAndWindow.call(this, term, termIndex, termLexicalChainDictOfB);
    });

    let denominatorOfA = 0;
    _.forEach(termList, (term, termIndex) => {
      denominatorOfA += Math.pow(
        wTermAndWindow.call(this, term, termIndex, termLexicalChainDictOfA),
        2
      );
    });

    let denominatorOfB = 0;
    _.forEach(termList, (term, termIndex) => {
      denominatorOfB += Math.pow(
        wTermAndWindow.call(this, term, termIndex, termLexicalChainDictOfB),
        2
      );
    });

    let lexicalCohesion: number = 0;
    if (denominatorOfA > 0 && denominatorOfB > 0) {
      lexicalCohesion = numerator / Math.sqrt(denominatorOfA * denominatorOfB);
      // lexicalCohesion =
      //   numerator / (Math.sqrt(denominatorOfA) * Math.sqrt(denominatorOfB));
    }
    return lexicalCohesion;

    function wTermAndWindow(
      this: LCseg,
      term: string,
      termIndex: number,
      termLexicalChainDictOfWindow: TermLexicalChainDict
    ): number {
      if (term in termLexicalChainDictOfWindow) {
        return this.scoreRi(
          term,
          termIndex,
          this.frequencyVector,
          this.totalSentenceObjects
        );
      } else {
        return 0;
      }
    }

    function makeCombinedTermLexicalChainDict(
      sentenceIndicesOfWindow: number[],
      sentenceIndexLexicalChainsDict: SentenceIndexLexicalChainsDict
    ): TermLexicalChainDict {
      const combinedTermLexicalChainDict: TermLexicalChainDict = {};

      _.forEach(sentenceIndicesOfWindow, (sentenceIndex) => {
        _.forEach(
          sentenceIndexLexicalChainsDict[sentenceIndex],
          (lexicalChain, term) => {
            combinedTermLexicalChainDict[term] = lexicalChain;
          }
        );
      });

      return combinedTermLexicalChainDict;
    }
  }

  /**
   *
   * @param term
   * @param termIndex
   * @param frequencyVectorOfTerms
   * @param totalSentenceObjects
   */
  private scoreRi(
    term: string,
    termIndex: number,
    frequencyVectorOfTerms: number[],
    totalSentenceObjects: SentenceObject[]
  ): number {
    const Li = _.sumBy(totalSentenceObjects, (sentenceObject) => {
      if (term in sentenceObject.compoundTermCountDict!) {
        return sentenceObject.compoundTermCountDict![term];
      } else {
        return 0;
      }
    });

    const score: number =
      frequencyVectorOfTerms[termIndex] *
      Math.log(totalSentenceObjects.length / Li);
    return score;
  }

  private makeSegmentationProability(
    sentenceIndex: number,
    termList: string[]
  ): number {
    const probability: number =
      0.5 *
      (this.lexicalCohesionFunction(
        [sentenceIndex - 2, sentenceIndex - 1],
        [sentenceIndex - 1, sentenceIndex],
        termList
      ) +
        this.lexicalCohesionFunction(
          [sentenceIndex, sentenceIndex + 1],
          [sentenceIndex + 1, sentenceIndex + 2],
          termList
        ) -
        2 *
          this.lexicalCohesionFunction(
            [sentenceIndex - 1, sentenceIndex],
            [sentenceIndex, sentenceIndex + 1],
            termList
          ));

    return probability;
  }
}
