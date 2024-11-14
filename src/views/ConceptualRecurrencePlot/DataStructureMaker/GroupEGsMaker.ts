/* eslint-disable no-unused-vars */
import _ from "lodash";
import { SimilarityBlock } from "../interfaces";
import { make1EngagementGroup } from "./make1EngagementGroup";

class GroupEGsMaker {
  private readonly minEngagementGroupSize: number = 4;

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

    if (conceptSimilarityMatrix.length !== 0) {
      const engagementGroups = this.trySplit2EGs(
        conceptSimilarityMatrix,
        this.minEngagementGroupSize,
        standardSemanticConsistency
      );
      return engagementGroups;
    } else {
      console.warn("no conceptSmilarityMatrix");
      return [];
    }
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

      // TODO Calulate with 2 Splits => Good Splits. But groups are changed smally in same num of groups
      // const scOfEG1 =
      //   (makeSemanticConsistency(engagementGroup1) /
      //     ((engagementGroup1.length * (engagementGroup1.length + 1)) / 2)) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      // const scOfEG2 =
      //   (makeSemanticConsistency(engagementGroup2) /
      //     ((engagementGroup2.length * (engagementGroup2.length + 1)) / 2)) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      // if (
      //   scOfEG1 >= standardSemanticConsistency &&
      //   scOfEG2 >= standardSemanticConsistency
      // ) {
      //   const semanticConsistency = scOfEG1 + scOfEG2;
      //   engagementGroupsCandidates.push([engagementGroup1, engagementGroup2]);
      //   semanticConsistencies.push(semanticConsistency);
      // }

      // TODO Calulate with only 1 Split => Good Splits
      // const scOfEG1 =
      //   (makeSemanticConsistency(engagementGroup1) /
      //     ((engagementGroup1.length * (engagementGroup1.length + 1)) / 2)) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      // const scOfEG2 =
      //   (makeSemanticConsistency(engagementGroup2) /
      //     ((engagementGroup2.length * (engagementGroup2.length + 1)) / 2)) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      // if (
      //   scOfEG1 >= standardSemanticConsistency ||
      //   scOfEG2 >= standardSemanticConsistency
      // ) {
      //   const semanticConsistency = scOfEG1 > scOfEG2 ? scOfEG1 : scOfEG2;
      //   engagementGroupsCandidates.push([engagementGroup1, engagementGroup2]);
      //   semanticConsistencies.push(semanticConsistency);
      // }

      // TODO Calulate with Together => Good Splits
      const scOfEG1 = makeSemanticConsistency(engagementGroup1);
      const scOfEG2 = makeSemanticConsistency(engagementGroup2);
      const semanticConsistency =
        ((scOfEG1 + scOfEG2) /
          ((engagementGroup1.length * (engagementGroup1.length + 1)) / 2 +
            (engagementGroup2.length * (engagementGroup2.length + 1)) / 2)) *
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

    function makeSemanticConsistency(
      similarityBlockGroup: SimilarityBlock[][]
    ): number {
      const sum: number = _.chain(similarityBlockGroup)
        .map((rowSimilarityBlocks) => {
          return _.sumBy(
            rowSimilarityBlocks,
            (similarityBlock) => similarityBlock.similarity
          );
        })
        .sum()
        .value();

      const semanticConsistency = sum;
      // const numOfSimilarities =
      //   (similarityBlockGroup.length * (similarityBlockGroup.length + 1)) / 2;
      // const semanticConsistency = sum / numOfSimilarities;
      // const semanticConsistency = sum / Math.sqrt(numOfSimilarities);
      // const semanticConsistency = sum / similarityBlockGroup.length;

      return semanticConsistency;
    }
  }
}

export const groupEGsMaker = new GroupEGsMaker();
