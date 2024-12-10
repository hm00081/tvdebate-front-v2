// eslint-disable-next-line
import _ from "lodash";

/**
 * Find top value indexes from number array
 * @param array
 * @param numOfTop
 */
export function findTopValueIndexes(
  array: Array<number>,
  numOfTop: number
): number[] {
  const sortedArray = _.orderBy(array, [], ["desc"]);
  // console.log("sortedArray", sortedArray);

  const topValueIndexes: number[] = [];

  let i = 0;
  let numberOfSame = 0;
  while (i < numOfTop) {
    let indexWanted: number = 0;
    while (indexWanted != -1) {
      indexWanted = _.indexOf(array, sortedArray[i], indexWanted);

      if (indexWanted >= 0) {
        topValueIndexes.push(indexWanted);
        indexWanted++;
        numberOfSame++;
      }
    }

    if (numberOfSame === 0) break;

    i += numberOfSame;
    numberOfSame = 0;
  }

  return topValueIndexes;
}
