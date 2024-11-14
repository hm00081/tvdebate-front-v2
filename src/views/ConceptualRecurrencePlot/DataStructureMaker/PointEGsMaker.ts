import _ from "lodash";
import { SimilarityBlock } from "../interfaces";
import { make1EngagementGroup } from "./make1EngagementGroup";

class PointEgsMaker {
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
      // find two candiates of engagement_point
      // row engagement_point
      const rowEngagementPoint = egCandidate[egCandidate.length - 1][i];
      // column engagement_point
      const colEngagementPoint = egCandidate[i - 1][0];

      const engagementGroup1 = make1EngagementGroup(egCandidate, 0, i);
      const engagementGroup2 = make1EngagementGroup(
        egCandidate,
        i,
        egCandidate.length
      );

      // TODO Calulate with 2 Splits => Bad Splits
      // const scOfEG1 =
      //   (rowEngagementPoint.similarityScore / 2) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      // const scOfEG2 =
      //   (colEngagementPoint.similarityScore / 2) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      // if (
      //   scOfEG1 >= standardSemanticConsistency &&
      //   scOfEG2 >= standardSemanticConsistency
      // ) {
      //   const semanticConsistency =
      //     scOfEG1 * engagementGroup1.length + scOfEG2 * engagementGroup2.length;

      //   engagementGroupsCandidates.push([engagementGroup1, engagementGroup2]);
      //   semanticConsistencies.push(semanticConsistency);
      // }

      // TODO Calulate with only 1 Split => Good Splits. Groups are changed well in constant score
      // const scOfEG1 =
      //   (rowEngagementPoint.similarityScore / 2) *
      //   ((egCandidate.length * (egCandidate.length + 1)) / 2);
      // const scOfEG2 =
      //   (colEngagementPoint.similarityScore / 2) *
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
      const scOfEG1 = rowEngagementPoint.similarity;
      const scOfEG2 = colEngagementPoint.similarity;
      const semanticConsistency =
        ((scOfEG1 + scOfEG2) / 2) *
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
  }
}

export const pointEGsMaker = new PointEgsMaker();
