// https://adventofcode.com/2024/day/1

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const { leftList, rightList } = inputLines
    .map((line) => line.match(/\d+/g)?.map(Number))
    .reduce<{ leftList: number[]; rightList: number[] }>(
      (acc, matchItem) => {
        if (!matchItem) {
          throw new Error('error while matching input numbers');
        }

        const [leftNum, rightNum] = matchItem;

        acc.leftList.push(leftNum);
        acc.rightList.push(rightNum);

        return acc;
      },
      { leftList: [], rightList: [] }
    );

  const leftListSorted = sortNumbersAsc(leftList);
  const rightListSorted = sortNumbersAsc(rightList);

  const distances = leftListSorted.map((leftNumber, index) => {
    const rightNumber = rightListSorted[index];
    return Math.abs(leftNumber - rightNumber);
  });

  const totalDistance = distances.reduce((sum, number) => sum + number, 0);

  const countInRightList = rightListSorted.reduce<Map<number, number>>(
    (acc, rightNumber) => {
      if (!acc.has(rightNumber)) {
        acc.set(rightNumber, 1);
      } else {
        acc.set(rightNumber, acc.get(rightNumber)! + 1);
      }
      return acc;
    },
    new Map()
  );

  const similarityScore = leftListSorted.reduce(
    (sum, leftNumber) =>
      sum + leftNumber * (countInRightList.get(leftNumber) ?? 0),
    0
  );

  return {
    part1: totalDistance,
    part2: similarityScore,
  };
}

function sortNumbersAsc(numbers: number[]) {
  return numbers.sort((a, b) => a - b);
}
