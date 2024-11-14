/* eslint-disable no-unused-vars */
import _ from "lodash";
import { SimilarityBlock } from "../interfaces";
import { make1EngagementGroup } from "./make1EngagementGroup";

class LineEGsMaker {
  private minEngagementGroupSize: number = 4;

  constructor() {
    //
  }

  public make(
    conceptSimilarityMatrix: SimilarityBlock[][],
    standardSemanticConsistency: number
  ): SimilarityBlock[][][] {
    // initiate engagementPoints
    _.forEach(conceptSimilarityMatrix, (rowSimilarityLine) => {
      _.forEach(rowSimilarityLine, (similarityBlock) => {
        similarityBlock.engagementPoint = false;
      });
    });

    const engagementGroups = this.trySplit2EGs(
      conceptSimilarityMatrix,
      this.minEngagementGroupSize,
      standardSemanticConsistency
    );
    return engagementGroups;
  }

  private trySplit2EGs(
    egCandidate: SimilarityBlock[][],
    minEngagementGroupSize: number,
    standardSemanticConsistency: number
  ): SimilarityBlock[][][] {
    // mark engagement_point
    const engagementPoint = egCandidate[egCandidate.length - 1][0];
    engagementPoint.engagementPoint = true;

    const engagementGroupsCandidates: SimilarityBlock[][][][] = [];
    const semanticConsistencies: number[] = [];

    const lastRowBlocks = egCandidate[egCandidate.length - 1];
    for (
      let i = minEngagementGroupSize;
      i < lastRowBlocks.length - minEngagementGroupSize;
      i++
    ) {
      // for each point, calculate semantic consistency of 2EGs
      const engagementGroup1 = make1EngagementGroup(egCandidate, 0, i + 1);
      const engagementGroup2 = make1EngagementGroup(
        egCandidate,
        i + 1,
        egCandidate.length
      );

      // TODO Calulate with 2 Splits => Good Splits. But groups are changed in same num of groups
      // const scOfEG1 =
      //   (makeSemanticConsistencyOfRowColLine(engagementGroup1) /
      //     (engagementGroup1.length * 2 - 1)) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      // const scOfEG2 =
      //   (makeSemanticConsistencyOfRowColLine(engagementGroup2) /
      //     (engagementGroup2.length * 2 - 1)) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      // if (
      //   scOfEG1 >= standardSemanticConsistency &&
      //   scOfEG2 >= standardSemanticConsistency
      // ) {
      //   const semanticConsistency = scOfEG1 + scOfEG2;
      //   engagementGroupsCandidates.push([engagementGroup1, engagementGroup2]);
      //   semanticConsistencies.push(semanticConsistency);
      // }

      // TODO Calulate with only 1 Split => Good Splits. Groups are changed well in constant score
      // const scOfEG1 =
      //   (makeSemanticConsistencyOfRowColLine(engagementGroup1) /
      //     (engagementGroup1.length * 2 - 1)) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      // const scOfEG2 =
      //   (makeSemanticConsistencyOfRowColLine(engagementGroup2) /
      //     (engagementGroup2.length * 2 - 1)) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      // if (
      //   scOfEG1 >= standardSemanticConsistency ||
      //   scOfEG2 >= standardSemanticConsistency
      // ) {
      //   const semanticConsistency = scOfEG1 > scOfEG2 ? scOfEG1 : scOfEG2;
      //   engagementGroupsCandidates.push([engagementGroup1, engagementGroup2]);
      //   semanticConsistencies.push(semanticConsistency);
      // }

      // TODO Calulate with Together => Good Splits. Groups are changed well in constant score
      const scOfEG1 = makeSemanticConsistencyOfRowColLine(engagementGroup1);
      const scOfEG2 = makeSemanticConsistencyOfRowColLine(engagementGroup2);
      const semanticConsistency =
        ((scOfEG1 + scOfEG2) /
          (engagementGroup1.length * 2 -
            1 +
            (engagementGroup2.length * 2 - 1))) *
        ((egCandidate.length * (egCandidate.length + 1)) / 2);
      if (semanticConsistency >= standardSemanticConsistency) {
        engagementGroupsCandidates.push([engagementGroup1, engagementGroup2]);
        semanticConsistencies.push(semanticConsistency);
      }
    }

    let engagementGroups: SimilarityBlock[][][];
    if (semanticConsistencies.length !== 0) {
      const maxValue = _.max(semanticConsistencies);
      const indexOfMax = _.indexOf(semanticConsistencies, maxValue);
      const engagementGroupsCandidate = engagementGroupsCandidates[indexOfMax];

      const splittdEGs1 = this.trySplit2EGs(
        engagementGroupsCandidate[0],
        this.minEngagementGroupSize,
        standardSemanticConsistency
      );
      const splittdEGs2 = this.trySplit2EGs(
        engagementGroupsCandidate[1],
        this.minEngagementGroupSize,
        standardSemanticConsistency
      );
      engagementGroups = _.concat(splittdEGs1, splittdEGs2);
    } else {
      engagementGroups = [egCandidate];
    }

    return engagementGroups;

    function makeSemanticConsistencyOfRowColLine(
      similarityBlockGroup: SimilarityBlock[][]
    ): number {
      const engagementPoint =
        similarityBlockGroup[similarityBlockGroup.length - 1][0];

      const rowLineAdded = _.reduce(
        similarityBlockGroup[similarityBlockGroup.length - 1],
        (reduced, rowSimilarityBlock) => {
          return reduced + rowSimilarityBlock.similarity;
        },
        0
      );

      const colLineAdded = _.reduce(
        similarityBlockGroup,
        (reduced, rowSimilarityLine) => {
          return reduced + rowSimilarityLine[0].similarity;
        },
        0
      );

      const sum = rowLineAdded + colLineAdded - engagementPoint.similarity;
      // const numOfSimilarities = similarityBlockGroup.length * 2 - 1;

      const semanticConsistency = sum;
      // const semanticConsistency = sum / numOfSimilarities;

      return semanticConsistency;
    }
  }
}

export const lineEGsMaker = new LineEGsMaker();
