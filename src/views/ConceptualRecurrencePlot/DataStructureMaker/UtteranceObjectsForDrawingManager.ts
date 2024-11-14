/* eslint-disable no-unused-vars */
import _ from "lodash";
import {
  SentenceObject,
  UtteranceObject,
} from "../../../interfaces/DebateDataInterface";
import { UtteranceObjectForDrawing } from "../interfaces";

// TODO making...
export default class UtteranceObjectsForDrawingManager {
  private _utteranceObjectsForDrawing: UtteranceObjectForDrawing[];
  private _positiveSumStandard: number = 0.5;
  private _sentenceSentimentStandard: number = 0.25;
  private _columnLongStandard: number = 100;

  public constructor(utteranceObjects: UtteranceObject[]) {
    // make utteranceObjectsForDrawing

    let beginningPointOfXY: number = 0;
    const widthResizingConstant: number = 2.6;

    const utteranceObjectsForDrawing: UtteranceObjectForDrawing[] = _.map(
      utteranceObjects,
      (utteranceObject) => {
        const width: number =
          Math.sqrt(utteranceObject.utterance.length) / widthResizingConstant;

        // make insistenceScore
        // const insistenceScore: number = _.reduce<SentenceObject, number>(
        //   utteranceObject.sentenceObjects,
        //   (reduced, sentenceObject) => {
        //     return sentenceObject.sentiment >= _sentenceSentimentStandard
        //       ? reduced + sentenceObject.sentiment
        //       : reduced;
        //   },
        //   0
        // );
        // const insistence: boolean =
        //   insistenceScore >= _positiveSumStandard &&
        //   utteranceObject.utterance.length > _columnLongStandard
        //     ? true
        //     : false;
        const insistence = this.getPositiveOrNot({
          utteranceObject,
          positiveSumStandard: this._positiveSumStandard,
          columnLongStandard: this._columnLongStandard,
          sentenceSentimentStandard: this._sentenceSentimentStandard,
        });

        const newUtteranceObject: UtteranceObjectForDrawing = {
          ...utteranceObject,
          beginningPointOfXY: beginningPointOfXY,
          width,
          insistence,
          mainKeytermsString: "",
          conceptVector: [],
          keyword: [],
        };
        beginningPointOfXY += newUtteranceObject.width;
        return newUtteranceObject;
      }
    );

    this._utteranceObjectsForDrawing = utteranceObjectsForDrawing;
  }

  private getPositiveOrNot(p: {
    utteranceObject: UtteranceObject | UtteranceObjectForDrawing;
    positiveSumStandard: number;
    sentenceSentimentStandard: number;
    columnLongStandard: number;
  }): boolean {
    // make insistenceScore
    const insistenceScore: number = _.reduce<SentenceObject, number>(
      p.utteranceObject.sentenceObjects,
      (reduced, sentenceObject) => {
        return sentenceObject.sentiment >= p.sentenceSentimentStandard
          ? reduced + sentenceObject.sentiment
          : reduced;
      },
      0
    );
    const insistence: boolean =
      insistenceScore >= p.positiveSumStandard ||
      p.utteranceObject.utterance.length > p.columnLongStandard
        ? true
        : false;

    return insistence;
  }

  private applyPositive(p: {
    utteranceObjectsForDrawing: UtteranceObjectForDrawing[];
    positiveSumStandard: number;
    sentenceSentimentStandard: number;
    columnLongStandard: number;
  }) {
    _.forEach(this.utteranceObjectsForDrawing, (utteranceObject) => {
      const insistence = this.getPositiveOrNot({
        utteranceObject,
        positiveSumStandard: this._positiveSumStandard,
        columnLongStandard: this._columnLongStandard,
        sentenceSentimentStandard: this._sentenceSentimentStandard,
      });
      utteranceObject.insistence = insistence;
    });
  }

  public get utteranceObjectsForDrawing() {
    return this._utteranceObjectsForDrawing;
  }
  public set positiveSumStandard(positiveSumStandard: number) {
    this._positiveSumStandard = positiveSumStandard;
    this.applyPositive({
      utteranceObjectsForDrawing: this._utteranceObjectsForDrawing,
      columnLongStandard: this._columnLongStandard,
      positiveSumStandard: this._positiveSumStandard,
      sentenceSentimentStandard: this._sentenceSentimentStandard,
    });
  }
  public set sentenceSentimentStandard(sentenceSentimentStandard: number) {
    this._sentenceSentimentStandard = sentenceSentimentStandard;
    this.applyPositive({
      utteranceObjectsForDrawing: this._utteranceObjectsForDrawing,
      columnLongStandard: this._columnLongStandard,
      positiveSumStandard: this._positiveSumStandard,
      sentenceSentimentStandard: this._sentenceSentimentStandard,
    });
  }
  public set colUtteranceLongStandard(columnLongStandard: number) {
    this._columnLongStandard = columnLongStandard;
    this.applyPositive({
      utteranceObjectsForDrawing: this._utteranceObjectsForDrawing,
      columnLongStandard: this._columnLongStandard,
      positiveSumStandard: this._positiveSumStandard,
      sentenceSentimentStandard: this._sentenceSentimentStandard,
    });
  }
}

export function makeUtteranceObjectsForDrawing(
  utteranceObjects: UtteranceObject[]
): UtteranceObjectForDrawing[] {
  let beginningPointOfXY: number = 0;
  const widthResizingConstant: number = 2.6;
  // TODO
  const _columnLongStandard: number = 50;
  const _positiveSumStandard: number = 0.5;
  const _sentenceSentimentStandard: number = 0.25;

  const utteranceObjectsForDrawing: UtteranceObjectForDrawing[] = _.map(
    utteranceObjects,
    (utteranceObject) => {
      const width: number =
        Math.sqrt(utteranceObject.utterance.length) / widthResizingConstant;

      // make insistenceScore
      const insistenceScore: number = _.reduce<SentenceObject, number>(
        utteranceObject.sentenceObjects,
        (reduced, sentenceObject) => {
          return sentenceObject.sentiment >= _sentenceSentimentStandard
            ? reduced + sentenceObject.sentiment
            : reduced;
        },
        0
      );
      const insistence: boolean =
        insistenceScore >= _positiveSumStandard
          ? // &&
            // utteranceObject.utterance.length > _columnLongStandard
            true
          : false;

      const newUtteranceObject: UtteranceObjectForDrawing = {
        ...utteranceObject,
        beginningPointOfXY: beginningPointOfXY,
        width,
        insistence,
        mainKeytermsString: "",
        conceptVector: [],
        keyword: [],
      };
      beginningPointOfXY += newUtteranceObject.width;
      return newUtteranceObject;
    }
  );

  return utteranceObjectsForDrawing;
}
