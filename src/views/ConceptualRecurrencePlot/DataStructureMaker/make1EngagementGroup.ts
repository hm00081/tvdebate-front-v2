import _ from "lodash";
import { SimilarityBlock } from "../interfaces";

/**
 *
 * @param conceptSimilarityGroup
 * @param startRowIndex
 * @param endRowIndex sliced until endRowIndex - 1
 */
export function make1EngagementGroup(
  conceptSimilarityGroup: SimilarityBlock[][],
  startRowIndex: number,
  endRowIndex: number
): SimilarityBlock[][] {
  const engagementGroup = _.chain(conceptSimilarityGroup)
    .slice(startRowIndex, endRowIndex)
    .map((rowSimilarityLine) => {
      return _.slice(
        rowSimilarityLine,
        startRowIndex,
        rowSimilarityLine.length
      );
    })
    .value();

  return engagementGroup;
}
