/* eslint-disable no-unused-vars */
import _ from "lodash";
import {
  makeParticipants,
  Participant,
  ParticipantDict,
} from "../../../common_functions/makeParticipants";
import { DebateDataSet } from "../../../interfaces/DebateDataInterface";
import {
  SimilarityBlock,
  UtteranceIndexSentenceIndexTotalSentenceIndexDict,
  UtteranceObjectForDrawing,
} from "../interfaces";
import {
  makeManualTGs,
  // getBasicIncomeManualSmallEGTitles,
  getBasicIncomeManualMiddleEGTitles,
  getBasicIncomeManualBigEGTitles,
  getSatManualBigEGTitles,
  getMilitaryManualSmallEGTitles,
  getMilitaryManualSmallEGOneTitles, // 추가
  getMilitaryManualMiddleEGTitles,
  getMilitaryManualBigEGTitles,
} from "./makeManualEGs";
import UtteranceObjectsForDrawingManager from "./UtteranceObjectsForDrawingManager";
import { SimilarityBlockManager } from "./SimilarityBlockManager";
import { DebateName } from "../DataImporter";

export interface DataStructureSet {
  // utteranceObjectsForDrawing: UtteranceObjectForDrawing[];
  utteranceObjectsForDrawingManager: UtteranceObjectsForDrawingManager;
  participants: Participant[];
  participantDict: ParticipantDict;
  // conceptSimilarityBlocks: SimilarityBlock[];
  // conceptSimilarityMatrix: SimilarityBlock[][];
  similarityBlockManager: SimilarityBlockManager;
  maxSimilarityScore: number;
  utteranceIndexSentenceIndexTotalSentenceIndexDict: UtteranceIndexSentenceIndexTotalSentenceIndexDict;
}
export interface DataSetOfManualTGs {
  manualSmallEGs: SimilarityBlock[][][];
  manualSmallEGsOne: SimilarityBlock[][][];
  manualMiddleEGsTwo: SimilarityBlock[][][];
  manualSmallEGsThree: SimilarityBlock[][][];
  manualMiddleEGsFour: SimilarityBlock[][][];
  manualSmallEGsFive: SimilarityBlock[][][];
  manualMiddleEGsSix: SimilarityBlock[][][];
  manualSmallEGsSeven: SimilarityBlock[][][];
  manualMiddleEGs: SimilarityBlock[][][];
  manualBigEGs: SimilarityBlock[][][];
  manualSmallEGTitles: string[];
  manualMiddleEGTitles: string[];
  manualBigEGTitles: string[];
}
export class DataStructureManager {
  private _dataStructureSet: DataStructureSet;
  private _datasetOfManualEGs: DataSetOfManualTGs;

  constructor(debateName: DebateName, debateDataSet: DebateDataSet) {
    const utteranceObjectsForDrawingManager = new UtteranceObjectsForDrawingManager(
      debateDataSet.utteranceObjects
    );
    const utteranceObjectsForDrawing =
      utteranceObjectsForDrawingManager.utteranceObjectsForDrawing;

    // const utteranceObjectsForDrawing = makeUtteranceObjectsForDrawing(
    //   debateDataSet.utteranceObjects
    // );

    const participants: Participant[] = makeParticipants(
      debateName,
      debateDataSet.utteranceObjects
    );
    const participantDict: ParticipantDict = _.keyBy(
      participants,
      (participant) => participant.name
    );

    const similarityBlockManager = new SimilarityBlockManager(
      debateDataSet.conceptMatrixTransposed,
      utteranceObjectsForDrawing,
      debateDataSet.keytermObjects,
      participantDict
    );
    const conceptSimilarityBlocks: SimilarityBlock[] =
      similarityBlockManager.similarityBlocks;
    const conceptSimilarityMatrix: SimilarityBlock[][] =
      similarityBlockManager.similarityBlockGroup;

    const maxSimilarityScore: number = _.maxBy(
      conceptSimilarityBlocks,
      (conceptSimilarityBlock) => conceptSimilarityBlock.similarity
    )!.similarity;

    // make utterance_index => sentence_index => total_sentence_index
    const utteranceIndexSentenceIndexTotalSentenceIndexDict: UtteranceIndexSentenceIndexTotalSentenceIndexDict = {};
    let totalSentenceIndex: number = 0;
    _.forEach(
      debateDataSet.utteranceObjects,
      (utteranceObject, utteranceIndex) => {
        utteranceIndexSentenceIndexTotalSentenceIndexDict[utteranceIndex] = {};
        _.forEach(
          utteranceObject.sentenceObjects,
          (sentenceObject, sentenceIndex) => {
            utteranceIndexSentenceIndexTotalSentenceIndexDict[utteranceIndex][
              sentenceIndex
            ] = totalSentenceIndex;
            totalSentenceIndex++;
          }
        );
      }
    );

    // dataset of manual engagement groups
    let manualSmallEGs: SimilarityBlock[][][] = [];
    let manualSmallEGsOne: SimilarityBlock[][][] = [];
    let manualMiddleEGsTwo: SimilarityBlock[][][] = [];
    let manualSmallEGsThree: SimilarityBlock[][][] = [];
    let manualMiddleEGsFour: SimilarityBlock[][][] = [];
    let manualSmallEGsFive: SimilarityBlock[][][] = [];
    let manualMiddleEGsSix: SimilarityBlock[][][] = [];
    let manualSmallEGsSeven: SimilarityBlock[][][] = [];
    let manualMiddleEGs: SimilarityBlock[][][] = [];
    let manualBigEGs: SimilarityBlock[][][] = [];
    let manualSmallEGTitles: string[] = [];
    let manualMiddleEGTitles: string[] = [];
    let manualBigEGTitles: string[] = [];
    if (debateName === "기본소득") {
      manualSmallEGs = makeManualTGs(conceptSimilarityMatrix, [
        0,
        22,
        47,
        52,
        68,
        73,
        79,
        97,
        132,
        134,
        177,
        185,
      ]);
      manualMiddleEGs = makeManualTGs(conceptSimilarityMatrix, [
        // 0,
        // 22,
        // 47,
        69,
        97,
        133,
        // 134,
        177,
      ]);
      manualBigEGs = makeManualTGs(conceptSimilarityMatrix, [
        0,
        22,
        47,
        69,
        133,
        177,
      ]);
      // manualSmallEGTitles = getBasicIncomeManualSmallEGTitles();
      manualMiddleEGTitles = getBasicIncomeManualMiddleEGTitles();
      manualBigEGTitles = getBasicIncomeManualBigEGTitles();
    } else if (debateName === "기본소득clipped") {
      manualSmallEGs = makeManualTGs(conceptSimilarityMatrix, [
        0,
        22,
        47,
        52,
        68,
        73,
        79,
        97,
      ]);
      // manualMiddleEGs = makeManualTGs(conceptSimilarityMatrix, [
      //   0,
      //   22,
      //   47,
      //   69,
      //   79,
      //   97,
      //   132,
      //   134,
      //   177,
      // ]);
      // manualBigEGs = makeManualTGs(conceptSimilarityMatrix, [
      //   0,
      //   22,
      //   47,
      //   69,
      //   133,
      //   177,
      // ]);
      // manualSmallEGTitles = getBasicIncomeManualSmallEGTitles();
      // manualMiddleEGTitles = getBasicIncomeManualMiddleEGTitles();
      // manualBigEGTitles = getBasicIncomeManualBigEGTitles();
    } else if (debateName === "정시확대") {
      manualBigEGs = makeManualTGs(conceptSimilarityMatrix, [
        0,
        15,
        35,
        139,
        159,
        244,
        293,
        313,
      ]);
      manualBigEGTitles = getSatManualBigEGTitles();
    } else if (debateName === "모병제") {
      //TODO 효지형 사진 올려준거처럼 인덱싱 부여.
      // 논쟁 Rect가 이루어져야 하는 구간들 List.
      // 0-18,
      // 15-37,
      // 24-58,
      // 56-79,
      // 73-106,
      // 94-126,
      // 146-183,
      // 위에 바꾼 list들
      // 1) 0,18,24,58,73,106,146,183
      // 2) 15,37,56,79,94,126
      manualSmallEGs = makeManualTGs(conceptSimilarityMatrix, [
        // 기존 그룹
        // 0,
        // 56,
        // 113,
        // //130,
        // 146,
        0,
        18,
        24, // 18-24 없애기
        58,
        73, // 58-73 없애기
        106,
        146, // 106-146 없애기
      ]);
      manualSmallEGsOne = makeManualTGs(conceptSimilarityMatrix, [0, 18]);
      manualSmallEGsThree = makeManualTGs(conceptSimilarityMatrix, [24, 58]);
      manualSmallEGsFive = makeManualTGs(conceptSimilarityMatrix, [73, 106]);
      manualSmallEGsSeven = makeManualTGs(conceptSimilarityMatrix, [146, 183]);
      manualMiddleEGs = makeManualTGs(conceptSimilarityMatrix, [
        // 기존 topicGroup
        // 14, 57, 175
        15,
        37,
        43, // 37-56 없애기
        79,
        94, // 79-94 없애기
        126,
      ]);
      manualMiddleEGsTwo = makeManualTGs(conceptSimilarityMatrix, [15, 37]);
      manualMiddleEGsFour = makeManualTGs(conceptSimilarityMatrix, [43, 79]);
      manualMiddleEGsSix = makeManualTGs(conceptSimilarityMatrix, [94, 126]);
      manualBigEGs = makeManualTGs(conceptSimilarityMatrix, [
        // 기존 topicGroup
        // 0,
        // 14,
        // 36,
        // 57,
        // 78,
        // 93,
        // 108,
        // 138,
        // 175,
      ]);
      manualSmallEGTitles = getMilitaryManualSmallEGTitles();
      manualMiddleEGTitles = getMilitaryManualMiddleEGTitles();
      manualBigEGTitles = getMilitaryManualBigEGTitles();
    } else if (debateName === "sample") {
      manualSmallEGs = makeManualTGs(conceptSimilarityMatrix, [0, 5]);
    }

    this._dataStructureSet = {
      // utteranceObjectsForDrawing,
      utteranceObjectsForDrawingManager,
      participants,
      participantDict,
      // conceptSimilarityBlocks,
      // conceptSimilarityMatrix,
      similarityBlockManager,
      maxSimilarityScore,
      utteranceIndexSentenceIndexTotalSentenceIndexDict,
    };
    //@ts-ignore
    this._datasetOfManualEGs = {
      manualSmallEGs,
      manualSmallEGsOne, // 이제 1개의 값에 대해서만 그려짐: 이게  CP1K에 대응, SampleDrawer.ts가 이제 CP1K 코드 모듈화한거 보여주도록하면 됨.
      manualMiddleEGsTwo,
      manualSmallEGsThree,
      manualMiddleEGsFour,
      manualSmallEGsFive,
      manualMiddleEGsSix,
      manualSmallEGsSeven,
      manualMiddleEGs,
      manualBigEGs,
      manualSmallEGTitles,
      manualMiddleEGTitles,
      manualBigEGTitles,
    }; // 각각값들 추가해야함
  }

  public get dataStructureSet() {
    return this._dataStructureSet;
  }
  public get datasetOfManualEGs() {
    return this._datasetOfManualEGs;
  }
}
