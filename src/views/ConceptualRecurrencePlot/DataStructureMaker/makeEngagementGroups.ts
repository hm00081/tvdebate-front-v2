/**
 * Deprecated
 */

/* eslint-disable no-unused-vars */
import _ from "lodash";
import { SimilarityBlock } from "../interfaces";
import { make1EngagementGroupByUtteranceIndex } from "./makeManualEGs";

export function makeEngagementGroups(
  conceptSimilarityMatrix: SimilarityBlock[][],
  standardHighPoint: number
): SimilarityBlock[][][] {
  // TODO logic of slow performance
  _.forEach(conceptSimilarityMatrix, (rowSimilarityBlocks) => {
    _.forEach(rowSimilarityBlocks, (similarityBlock) => {
      similarityBlock.engagementPoint = false;
    });
  });

  const minEngagementGroupSize: number = 4;

  // based on initial_block_for_grouping,
  // split engagement_groups of initial
  const initialBlockForGrouping = makeInitialBlockForGrouping(
    conceptSimilarityMatrix,
    standardHighPoint,
    minEngagementGroupSize
  );

  const standardInternalConsistency = 16000;
  // const standardInternalConsistency = 100;
  let internalConsistency = 0;

  // split candidate engagement_groups based on initial_block_for_grouping
  const bigEngagementGroupCandidate1 = make1EngagementGroupByUtteranceIndex(
    conceptSimilarityMatrix,
    0,
    initialBlockForGrouping.columnUtteranceIndex + 1
  );

  internalConsistency = calculateInternalConsistency(
    bigEngagementGroupCandidate1
  );
  let canBeEG1: boolean = true;
  if (internalConsistency < standardInternalConsistency) {
    canBeEG1 = false;
  }

  const bigEngagementGroupCandidate2 = make1EngagementGroupByUtteranceIndex(
    conceptSimilarityMatrix,
    initialBlockForGrouping.columnUtteranceIndex,
    initialBlockForGrouping.rowUtteranceIndex + 1
  );

  const bigEngagementGroupCandidate3 = make1EngagementGroupByUtteranceIndex(
    conceptSimilarityMatrix,
    initialBlockForGrouping.rowUtteranceIndex,
    conceptSimilarityMatrix.length + 1
  );

  // splitBigToSmallEngagement
  const engagementGroups1 = splitBigToSmallEngagementGroups(
    bigEngagementGroupCandidate1,
    minEngagementGroupSize,
    0,
    "none"
  );
  if (bigEngagementGroupCandidate1 !== engagementGroups1[0] || canBeEG1) {
    // TODO
    // _.concat(totalEngagementGroups, engagementGroups1)
  }

  const engagementGroups2 = splitBigToSmallEngagementGroups(
    bigEngagementGroupCandidate2,
    minEngagementGroupSize,
    0,
    "none"
  );
  // const engagementGroups3: SimilarityBlock[][][] = [];
  const engagementGroups3 = splitBigToSmallEngagementGroups(
    bigEngagementGroupCandidate3,
    minEngagementGroupSize,
    0,
    "none"
  );

  const totalEngagementGroups = _.concat(
    engagementGroups1,
    engagementGroups2,
    engagementGroups3
  );

  // _.forEach(totalEngagementGroups, (eg, i) => {
  //   console.log(`eg ${i}`, calculateInternalConsistency(eg));
  // });

  return totalEngagementGroups;

  // make candidate engagement_groups
  // find high point from far to close.
  function makeInitialBlockForGrouping(
    conceptSimilarityMatrix: SimilarityBlock[][],
    standardHighPoint: number,
    minEngagementGroupSize: number
  ): SimilarityBlock {
    let exploringBreadth: number = conceptSimilarityMatrix.length - 1;
    let canBreakOfFindingInitialBlock: boolean = false;

    // find initial_block_for_grouping
    let initialBlockForGrouping: SimilarityBlock =
      conceptSimilarityMatrix[conceptSimilarityMatrix.length - 1][0];
    while (exploringBreadth > 0) {
      for (
        let i = minEngagementGroupSize;
        i <
        conceptSimilarityMatrix.length -
          exploringBreadth -
          minEngagementGroupSize;
        i++
      ) {
        const similarityBlock =
          conceptSimilarityMatrix[exploringBreadth + i][i];

        if (similarityBlock.similarity > standardHighPoint) {
          initialBlockForGrouping = similarityBlock;
          similarityBlock.engagementPoint = true;
          canBreakOfFindingInitialBlock = true;
          break;
        }
      }

      if (canBreakOfFindingInitialBlock) break;
      exploringBreadth--;
    }

    return initialBlockForGrouping;
  }

  function splitBigToSmallEngagementGroups(
    candidate: SimilarityBlock[][],
    minEngagementGroupSize: number,
    depth: number,
    trace: string
  ): SimilarityBlock[][][] {
    const engagementPoint = candidate[candidate.length - 1][0];
    engagementPoint.engagementPoint = true;

    // For each candidate_of_engagementgroup, do recursion of finding splitting_point
    let engagementGroups: SimilarityBlock[][][] = [];

    // Find Similarity Block having High Point
    for (
      let i = minEngagementGroupSize;
      i < candidate.length - minEngagementGroupSize;
      i++
    ) {
      // Explore horizontally right
      if (candidate[candidate.length - 1][i].similarity > standardHighPoint) {
        if (candidate[i - 1][0].similarity > 0) {
          // split engagement_groups
          const splittingRowIndex: number = i - 1;
          engagementGroups = splitRecursive(
            candidate,
            splittingRowIndex,
            depth,
            trace
          );

          /**
           *
           */
          // TODO
          // const standardInternalConsistency = 8000;
          // // const standardInternalConsistency = 100;
          // let internalConsistency = 0;
          // let if2Continue: number = 0;

          // const engagementGroupCandidate1 = _.slice(
          //   candidate,
          //   0,
          //   splittingRowIndex + 1
          // );

          // // TODO calculate internal consistency
          // internalConsistency = calculateInternalConsistency(
          //   engagementGroupCandidate1
          // );
          // // console.log("internalConsistency1", internalConsistency);
          // let canBeEG1: boolean = true;
          // if (internalConsistency < standardInternalConsistency) {
          //   canBeEG1 = false;
          //   if2Continue++;
          // }
          // // Do Recursion
          // const splitted1EngagementGroups = splitBigToSmallEngagementGroups(
          //   engagementGroupCandidate1,
          //   minEngagementGroupSize,
          //   depth + 1,
          //   `${trace} > top`
          // );

          // const sliced2_2 = _.slice(
          //   candidate,
          //   splittingRowIndex + 1,
          //   candidate.length
          // );
          // const engagementGroupCandidate2 = _.map(
          //   sliced2_2,
          //   (verticalSimilarityBlocks) => {
          //     return _.slice(
          //       verticalSimilarityBlocks,
          //       splittingRowIndex + 1,
          //       verticalSimilarityBlocks.length
          //     );
          //   }
          // );

          // internalConsistency = calculateInternalConsistency(
          //   engagementGroupCandidate2
          // );
          // // console.log("internalConsistency2", internalConsistency);
          // let canBeEG2: boolean = true;
          // if (internalConsistency < standardInternalConsistency) {
          //   canBeEG2 = false;
          //   if2Continue++;
          //   if (if2Continue === 2) continue;
          // }

          // // Do Recursion
          // const splitted2EngagementGroups = splitBigToSmallEngagementGroups(
          //   engagementGroupCandidate2,
          //   minEngagementGroupSize,
          //   depth + 1,
          //   `${trace} > bottom`
          // );

          // if (
          //   engagementGroupCandidate1 !== splitted1EngagementGroups[0] ||
          //   canBeEG1
          // ) {
          //   engagementGroups = _.concat(
          //     engagementGroups,
          //     splitted1EngagementGroups
          //   );
          // }
          // if (
          //   engagementGroupCandidate2 !== splitted2EngagementGroups[0] ||
          //   canBeEG2
          // ) {
          //   engagementGroups = _.concat(
          //     engagementGroups,
          //     splitted2EngagementGroups
          //   );
          // }

          /**
           *
           */
          break;
        }
      }

      // Explore vertically up
      if (
        candidate[candidate.length - 1 - minEngagementGroupSize - i][0]
          .similarity > standardHighPoint
      ) {
        if (
          candidate[candidate.length - 1][
            candidate.length - 1 - minEngagementGroupSize - i + 1
          ].similarity > 0
        ) {
          // split engagement_groups
          const splittingRowIndex: number =
            candidate.length - 1 - minEngagementGroupSize - i;
          engagementGroups = splitRecursive(
            candidate,
            splittingRowIndex,
            depth,
            trace
          );
          break;
        }
      }
    }

    if (engagementGroups.length === 0) {
      engagementGroups = [candidate];
    }

    return engagementGroups;
  }

  function splitRecursive(
    candidate: SimilarityBlock[][],
    splittingRowIndex: number,
    depth: number,
    trace: string
  ) {
    // TODO
    // const standardInternalConsistency = 16000;
    const standardInternalConsistency = 0;
    let internalConsistency = 0;

    let engagementGroups: SimilarityBlock[][][] = [];

    const engagementGroupCandidate1 = _.slice(
      candidate,
      0,
      splittingRowIndex + 1
    );

    // TODO calculate internal consistency
    internalConsistency = calculateInternalConsistency(
      engagementGroupCandidate1
    );
    // console.log("internalConsistency1", internalConsistency);
    if (internalConsistency > standardInternalConsistency) {
      // Do Recursion
      const splitted1EngagementGroups = splitBigToSmallEngagementGroups(
        engagementGroupCandidate1,
        minEngagementGroupSize,
        depth + 1,
        `${trace} > top`
      );
      engagementGroups = _.concat(engagementGroups, splitted1EngagementGroups);
    }

    const sliced2_2 = _.slice(
      candidate,
      splittingRowIndex + 1,
      candidate.length
    );
    const engagementGroupCandidate2 = _.map(
      sliced2_2,
      (verticalSimilarityBlocks) => {
        return _.slice(
          verticalSimilarityBlocks,
          splittingRowIndex + 1,
          verticalSimilarityBlocks.length
        );
      }
    );

    internalConsistency = calculateInternalConsistency(
      engagementGroupCandidate2
    );
    // console.log("internalConsistency2", internalConsistency);
    if (internalConsistency > standardInternalConsistency) {
      // Do Recursion
      const splitted2EngagementGroups = splitBigToSmallEngagementGroups(
        engagementGroupCandidate2,
        minEngagementGroupSize,
        depth + 1,
        `${trace} > bottom`
      );
      engagementGroups = _.concat(engagementGroups, splitted2EngagementGroups);
    }

    return engagementGroups;
  }

  function calculateInternalConsistency(
    candidate: SimilarityBlock[][]
  ): number {
    const engagementPoint = candidate[candidate.length - 1][0];

    const rowLineAdded = _.reduce(
      candidate[candidate.length - 1],
      (reduced, rowSimilarityBlock) => {
        return reduced + rowSimilarityBlock.similarity;
      },
      0
    );

    const colLineAdded = _.reduce(
      candidate,
      (reduced, rowSimilarityBlocks) => {
        return reduced + rowSimilarityBlocks[0].similarity;
      },
      0
    );

    const internalConsistency =
      (rowLineAdded + colLineAdded - engagementPoint.similarity) /
      (candidate.length * 2 - 1);

    return internalConsistency;
  }
}
