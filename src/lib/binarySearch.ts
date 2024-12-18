export function binarySearch(
  maxIndex: number,
  checkIndex: (index: number) => -1 | 0 | 1
): number | undefined {
  let leftIndex = 0;
  let rightIndex = maxIndex;
  let middleIndex;

  while (leftIndex <= rightIndex) {
    middleIndex = Math.floor((leftIndex + rightIndex) / 2);
    const compareResult = checkIndex(middleIndex);
    if (compareResult === 0) {
      return middleIndex;
    }
    if (compareResult === -1) {
      leftIndex = middleIndex + 1;
    } else if (compareResult === 1) {
      rightIndex = middleIndex - 1;
    }
  }
}
