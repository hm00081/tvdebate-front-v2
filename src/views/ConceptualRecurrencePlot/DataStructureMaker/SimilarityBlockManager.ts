/* eslint-disable no-unused-vars */
import _ from "lodash";
import * as math from "mathjs";
import { findTopValueIndexes } from "../../../common_functions/findTopValueIndexes";
import { ParticipantDict } from "../../../common_functions/makeParticipants";
import {
  KeytermObject,
  SentenceObject,
  UtteranceObject,
} from "../../../interfaces/DebateDataInterface";
import { SimilarityBlock, UtteranceObjectForDrawing } from "../interfaces";
const makeCosineSimilarity = require("compute-cosine-similarity");

export class SimilarityBlockManager {
  private _similarityBlocks: SimilarityBlock[] = [];
  private _similarityBlockGroup: SimilarityBlock[][] = [];
  private _selfConsistencyWeight: number = 1;
  private _otherConsistencyWeight: number = 3;
  private _refutationWeight: number = 0.5; // 반박가중치 default 값은 1
  private _insistenceWeight: number = 0.5; // 주장가중치
  private _sentenceSentimentStandard: number = 0.25;
  private _negativeSumStandard: number = 0.0001; // negative 가중치
  private _positiveSumStandard: number = 0.5;
  private _colUtteranceLongStandard: number = 5;
  private _hostWeight: number = 1;
  private _hostLongStandard: number = 100; // Host 문자 수
  private _debaterWeights: number[] = [1, 1, 1, 1];
  private _debaterIndexDict: { [debaterName: string]: number } = {};

  public constructor(
    conceptMatrixTransposed: number[][],
    private readonly utteranceObjectsForDrawing: UtteranceObjectForDrawing[],
    keytermObjects: KeytermObject[],
    private readonly participantDict: ParticipantDict
  ) {
    // Make similarity_block
    for (
      let utteranceRowIndex = 1;
      utteranceRowIndex < conceptMatrixTransposed.length;
      utteranceRowIndex++
    ) {
      this._similarityBlockGroup.push([]);
      for (
        let utteranceColIndex = 0;
        utteranceColIndex < utteranceRowIndex;
        utteranceColIndex++
      ) {
        const rowUtteranceConcept = conceptMatrixTransposed[utteranceRowIndex];
        const colUtteranceConcept = conceptMatrixTransposed[utteranceColIndex];
        const rowUtteranceObject =
          utteranceObjectsForDrawing[utteranceRowIndex];
        const colUtteranceObject =
          utteranceObjectsForDrawing[utteranceColIndex];
        const rowUtteranceName =
          utteranceObjectsForDrawing[utteranceRowIndex].name;
        const colUtteranceName =
          utteranceObjectsForDrawing[utteranceColIndex].name;

        const partsOfSimilarity = _.map(
          rowUtteranceConcept,
          (keytermScore1, i) => {
            const keytermScore2 = colUtteranceConcept[i];
            // We can check main keyterms to contribute similarityScore here
            return keytermScore1 * keytermScore2;
          }
        );
        const similarityScore = _.sum(partsOfSimilarity);

        const topValueIndexes = findTopValueIndexes(partsOfSimilarity, 10);
        const mainKeytermObjects = _.map(
          topValueIndexes,
          (topValueIndex) => keytermObjects[topValueIndex]
        );

        // Make simialrityBlock
        const conceptSimilarityBlock: SimilarityBlock = {
          beginningPointOfX: colUtteranceObject.beginningPointOfXY,
          beginningPointOfY: rowUtteranceObject.beginningPointOfXY,
          width: colUtteranceObject.width,
          height: rowUtteranceObject.width,
          similarity: similarityScore, // 여기서 유사도에 의한 계산이 진행됨.
          // similarityScore: math.dot(utterance1Concept, utterance2Concept),
          // similarityScore: makeCosineSimilarity(
          //   utterance1Concept,
          //   utterance2Concept
          // ),
          weight: 1, // 가중치에 의해 색상의 opacity가 부여
          mainKeytermObjects,
          rowUtteranceName: rowUtteranceName,
          colUtteranceName: colUtteranceName,
          rowUtteranceIndex: utteranceRowIndex,
          columnUtteranceIndex: utteranceColIndex,
          other: rowUtteranceObject.name !== colUtteranceObject.name,
          refutation: false, // 반박 default 값
          engagementPoint: false,
          visible: true,
          //id: 1,
        };
        // console.log(conceptSimilarityBlock.refutation);
        // Because cosine similairity between [0, 0, ...] and [0, 0, ...]
        // if (isNaN(conceptSimilarityBlock.similarity)) {
        //   conceptSimilarityBlock.similarity = 0;
        // }

        // Push the similarityBlock
        this._similarityBlocks.push(conceptSimilarityBlock);
        this._similarityBlockGroup[utteranceRowIndex - 1].push(
          conceptSimilarityBlock
        );
      }
    }

    // Apply refutation
    this.applyRefutation({
      utteranceObjectsForDrawing,
      participantDict,
      similarityBlocks: this._similarityBlocks,
      similarityBlockGroup: this._similarityBlockGroup,
      sentenceSentimentStandard: this._sentenceSentimentStandard,
      negativeSumStandard: this._negativeSumStandard,
      colUtteranceLongStandard: this._colUtteranceLongStandard,
    });
  }

  /**
   * applyWeightedSimilarity
   * @changed_variable : similarityBlock.weight of simialrityBlocks
   */
  // 가중치를 적용하기 위한 함수.
  private applyWeight() {
    _.forEach(this._similarityBlockGroup, (rowSimilarityBlocks) => {
      _.forEach(rowSimilarityBlocks, (similarityBlock) => {
        let weight: number = 1;

        const rowUtteranceObject: UtteranceObjectForDrawing = this
          .utteranceObjectsForDrawing[similarityBlock.rowUtteranceIndex];
        const colUtteranceObject: UtteranceObjectForDrawing = this
          .utteranceObjectsForDrawing[similarityBlock.columnUtteranceIndex];

        // apply other_consistency_weight
        // apply self_consistency_weight
        if (similarityBlock.other) {
          weight *= this._otherConsistencyWeight;
        } else {
          weight *= this._selfConsistencyWeight;
        }

        // apply refutation_weight
        if (similarityBlock.refutation) {
          weight *= this._refutationWeight;

          // apply insistence_weight
          if (colUtteranceObject.insistence) {
            weight *= this._insistenceWeight;
          }
        }
        //console.log(rowUtteranceObject);
        // apply host_weight
        if (
          ((rowUtteranceObject.name === "진행자" ||
            rowUtteranceObject.name === "Host") &&
            rowUtteranceObject.utterance.length > this._hostLongStandard) ||
          ((colUtteranceObject.name === "진행자" ||
            colUtteranceObject.name === "Host") &&
            colUtteranceObject.utterance.length > this._hostLongStandard)
        ) {
          weight *= this._hostWeight;
        }

        similarityBlock.weight = weight;
      });
    });
  }

  /**
   * applyRefutation
   * @param p
   * @changed_variable similarityBlock in similarityBlocks & similarityBlockGroup
   */
  // 반박구간 체크하는 부분
  private applyRefutation(p: {
    utteranceObjectsForDrawing: UtteranceObjectForDrawing[];
    participantDict: ParticipantDict;
    similarityBlocks: SimilarityBlock[];
    similarityBlockGroup: SimilarityBlock[][];
    sentenceSentimentStandard: number;
    negativeSumStandard: number;
    colUtteranceLongStandard: number;
  }) {
    _.forEach(p.similarityBlocks, (similarityBlock) => {
      similarityBlock.refutation = false;

      const rowUtteranceObject =
        p.utteranceObjectsForDrawing[similarityBlock.rowUtteranceIndex];
      const colUtteranceObject =
        p.utteranceObjectsForDrawing[similarityBlock.columnUtteranceIndex];
      // console.log(rowUtteranceObject.name);
      const refutationScore = _.reduce<SentenceObject, number>( // refutationScore
        rowUtteranceObject.sentenceObjects,
        (reduced, sentenceObject) => {
          return sentenceObject.sentiment <= -p.sentenceSentimentStandard
            ? reduced + sentenceObject.sentiment // 감성분석을 통해 감성값이 포함됨.
            : reduced;
        },
        0
      );

      if (
        refutationScore <= -p.negativeSumStandard ||
        refutationScore > -p.negativeSumStandard
      ) {
        //console.log("refutationScore", refutationScore);
        // console.log("-p.negativeSumStandard", -p.negativeSumStandard);

        const rowSimilarityBlocks =
          p.similarityBlockGroup[similarityBlock.rowUtteranceIndex - 1];
        // console.log(rowSimilarityBlocks);
        const filtered = _.filter(
          rowSimilarityBlocks,
          (rowSimilarityBlock, utteranceIndexOfrowSimilarityBlock) => {
            let isFilter: boolean = false;
            if (
              utteranceIndexOfrowSimilarityBlock >=
              similarityBlock.columnUtteranceIndex
            ) {
              const utteranceOjbect1 =
                p.utteranceObjectsForDrawing[similarityBlock.rowUtteranceIndex];
              const utteranceOjbect2 =
                p.utteranceObjectsForDrawing[
                  utteranceIndexOfrowSimilarityBlock
                ];
              const team1 = p.participantDict[utteranceOjbect1.name].team;
              const team2 = p.participantDict[utteranceOjbect2.name].team;

              if (team1 !== team2 && team1 > 0 && team2 > 0) {
                const utteranceObjectOfRebuttalTarget =
                  p.utteranceObjectsForDrawing[
                    rowSimilarityBlock.columnUtteranceIndex
                  ];
                // TODO
                // if (rowSimilarityBlock.similarityScore > 40000) {
                //   isFilter = true;
                // }
                if (
                  rowSimilarityBlock.similarity >= 0.1 &&
                  (utteranceObjectOfRebuttalTarget.utterance.length >
                    p.colUtteranceLongStandard ||
                    utteranceObjectOfRebuttalTarget.utterance.length <=
                      p.colUtteranceLongStandard)
                ) {
                  isFilter = true;
                }
              }
            }
            return isFilter;
          }
        );

        const team1 = p.participantDict[colUtteranceObject.name].team; // side(i,j)
        const team2 = p.participantDict[rowUtteranceObject.name].team; // side(i,j)
        const condition =
          (similarityBlock.similarity * similarityBlock.weight) /
          Math.sqrt(
            Math.abs(
              similarityBlock.columnUtteranceIndex -
                similarityBlock.rowUtteranceIndex
            )
          );
        if (
          //  논쟁의 판단 유무 구간 판단하는 if 문.
          // TODO
          (team1 !== team2 &&
            team1 > 0 &&
            team2 > 0 &&
            // similarityBlock.similarity > 0.05 &&
            similarityBlock.rowUtteranceName !== "진행자" &&
            similarityBlock.rowUtteranceName !== "Host") ||
          (similarityBlock.rowUtteranceName !== "진행자" &&
            similarityBlock.colUtteranceName !== "Host" &&
            condition >= 1 &&
            //colUtteranceObject.utterance.length > p.colUtteranceLongStandard ||
            filtered.length >= 1 &&
            // 발화자 간 거리
            similarityBlock.rowUtteranceIndex -
              similarityBlock.columnUtteranceIndex <
              //발화자 간 거리 어느정도 볼 지 설정하는 구간.
              156)
        ) {
          similarityBlock.refutation = true; // 주장과 반박 구간 결정하는 boolean value
        }
      }
    });
  }

  public get similarityBlocks(): SimilarityBlock[] {
    return this._similarityBlocks;
  }

  public get similarityBlockGroup(): SimilarityBlock[][] {
    return this._similarityBlockGroup;
  }

  public set selfConsistencyWeight(selfConsistencyWeight: number) {
    this._selfConsistencyWeight = selfConsistencyWeight;
    this.applyWeight();
  }
  public set otherConsistencyWeight(otherConsistencyWeight: number) {
    this._otherConsistencyWeight = otherConsistencyWeight;
    this.applyWeight();
  }
  public set refutationWeight(refutationWeight: number) {
    this._refutationWeight = refutationWeight;
    this.applyWeight();
  }
  public set insistenceWeight(insistenceWeight: number) {
    this._insistenceWeight = insistenceWeight;
    this.applyWeight();
  }
  public set sentenceSentimentStandard(sentenceSentimentStandard: number) {
    this._sentenceSentimentStandard = sentenceSentimentStandard;
    this.applyRefutation({
      utteranceObjectsForDrawing: this.utteranceObjectsForDrawing,
      participantDict: this.participantDict,
      similarityBlocks: this._similarityBlocks,
      similarityBlockGroup: this._similarityBlockGroup,
      sentenceSentimentStandard: this._sentenceSentimentStandard,
      negativeSumStandard: this._negativeSumStandard,
      colUtteranceLongStandard: this._colUtteranceLongStandard,
    });
    this.applyWeight();
  }
  public set negativeSumStandard(negativeSumStandard: number) {
    this._negativeSumStandard = negativeSumStandard;
    this.applyRefutation({
      utteranceObjectsForDrawing: this.utteranceObjectsForDrawing,
      participantDict: this.participantDict,
      similarityBlocks: this._similarityBlocks,
      similarityBlockGroup: this._similarityBlockGroup,
      sentenceSentimentStandard: this._sentenceSentimentStandard,
      negativeSumStandard: this._negativeSumStandard,
      colUtteranceLongStandard: this._colUtteranceLongStandard,
    });
    this.applyWeight();
  }
  public set colUtteranceLongStandard(colUtteranceLongStandard: number) {
    this._colUtteranceLongStandard = colUtteranceLongStandard;
    this.applyRefutation({
      utteranceObjectsForDrawing: this.utteranceObjectsForDrawing,
      participantDict: this.participantDict,
      similarityBlocks: this._similarityBlocks,
      similarityBlockGroup: this._similarityBlockGroup,
      sentenceSentimentStandard: this._sentenceSentimentStandard,
      negativeSumStandard: this._negativeSumStandard,
      colUtteranceLongStandard: this._colUtteranceLongStandard,
    });
    this.applyWeight();
  }

  public set positiveSumStandard(positiveSumStandard: number) {
    this.applyWeight();
  }

  public set hostWeight(hostWeight: number) {
    this._hostWeight = hostWeight;
    this.applyWeight();
  }

  public set hostLongStandard(hostLongStandard: number) {
    this._hostLongStandard = hostLongStandard;
    this.applyWeight();
  }
}
