// https://adventofcode.com/2024/day/22

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const initialSecretNumbers = inputLines.map((n) => parseInt(n, 10));

  return {
    part1: solvePart1(initialSecretNumbers),
    part2: solvePart2(initialSecretNumbers),
  };
}

function solvePart1(nums: number[]): number {
  return nums
    .map((num) => getNSecretNumber(num, 2000))
    .reduce((sum, num) => sum + num, 0);
}

function getNSecretNumber(num: number, n: number) {
  for (let i = 0; i < n; i++) {
    num = getNextSecretNumber(num);
  }

  return num;
}

function getNextSecretNumber(num: number): number {
  num = prune(mix(num, num * 64));
  num = prune(mix(num, Math.floor(num / 32)));
  num = prune(mix(num, num * 2048));

  return num;
}

function mix(secret: number, value: number): number {
  return secret ^ value;
}

function prune(secret: number): number {
  return ((secret % 16777216) + 16777216) % 16777216;
}

function solvePart2(initNums: number[]): number {
  const prices: number[][] = [];
  const diffs: number[][] = [];
  const priceBy4LastDiffs: Array<Map<string, number>> = [];

  for (let i = 0; i < initNums.length; i++) {
    let num = initNums[i];

    prices[i] = [num % 10];
    diffs[i] = [];
    priceBy4LastDiffs[i] = new Map<string, number>();

    for (let j = 1; j < 2001; j++) {
      num = getNextSecretNumber(num);

      prices[i][j] = num % 10;
      diffs[i][j] = prices[i][j] - prices[i][j - 1];

      // 5 -> 4 + 1 empty item at start
      if (diffs[i].length >= 5) {
        const diffsKey = getDiffsKey(diffs[i], j);
        if (!priceBy4LastDiffs[i].has(diffsKey)) {
          priceBy4LastDiffs[i].set(diffsKey, prices[i][j]);
        }
      }
    }
  }

  const allKeys = priceBy4LastDiffs.reduce<string[]>((acc, item) => {
    acc.push(...item.keys());
    return acc;
  }, []);

  const allKeysSet = new Set(allKeys);

  let max = 0;
  for (const key of allKeysSet) {
    const value = priceBy4LastDiffs.reduce(
      (sum, item) => sum + (item.get(key) ?? 0),
      0
    );
    if (value > max) {
      max = value;
    }
  }

  return max;
}

function getDiffsKey(diffs: number[], j: number): string {
  return `${diffs[j - 3]},${diffs[j - 2]},${diffs[j - 1]},${diffs[j]}`;
}
