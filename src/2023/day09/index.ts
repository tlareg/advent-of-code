// https://adventofcode.com/2023/day/9

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.split('\n');
}

function solve(inputLines: string[]) {
  const diffsPyramids = inputLines
    .map((line) =>
      line
        .trim()
        .split(' ')
        .map((n) => parseInt(n, 10))
    )
    .map(getDiffsPyramid);

  const nextValues = diffsPyramids.map((pyramid) => extrapolate(pyramid));
  const prevValues = diffsPyramids.map((pyramid) => extrapolate(pyramid, true));

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b);

  return {
    part1: sum(nextValues),
    part2: sum(prevValues),
  };
}

function getDiffsPyramid(history: number[]) {
  const diffsPyramid: number[][] = [history];

  while (diffsPyramid[diffsPyramid.length - 1].some((n) => n !== 0)) {
    diffsPyramid.push(getDiffs(diffsPyramid[diffsPyramid.length - 1]));
  }

  return diffsPyramid;
}

function getDiffs(nums: number[]) {
  const diffs = [];
  for (let i = 1; i < nums.length; i++) {
    diffs.push(nums[i] - nums[i - 1]);
  }
  return diffs;
}

function extrapolate(diffsPyramid: number[][], isBackwards: boolean = false) {
  const newPyramid = clone(diffsPyramid);

  const addVal = <T>(arr: T[], val: T) =>
    arr[isBackwards ? 'unshift' : 'push'](val);

  const getVal = <T>(arr: T[]) => (isBackwards ? arr[0] : arr[arr.length - 1]);

  for (let level = newPyramid.length - 1; level >= 0; level--) {
    const currentLevel = newPyramid[level];
    const nextLevel = newPyramid[level + 1];

    if (nextLevel === undefined) {
      addVal(currentLevel, 0);
    } else {
      const val = getVal(currentLevel);
      const nextLevelVal = getVal(nextLevel);
      addVal(
        currentLevel,
        isBackwards ? val - nextLevelVal : val + nextLevelVal
      );
    }
  }

  return getVal(newPyramid[0]);
}

function clone(pyramid: number[][]) {
  return pyramid.map((n) => [...n]);
}
