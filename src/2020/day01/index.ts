// https://adventofcode.com/2020/day/1

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const nums = inputLines.map((l) => Number(l));

  return {
    part1: solvePart1(nums),
    part2: solvePart2(nums),
  };
}

function solvePart1(nums: number[]): number {
  for (let i = 0; i < nums.length; i++) {
    const n1 = nums[i];
    for (let j = i + 1; j < nums.length; j++) {
      const n2 = nums[j];
      if (n1 + n2 === 2020) {
        return n1 * n2;
      }
    }
  }

  throw 'no part1 answer';
}

function solvePart2(nums: number[]): number {
  for (let i = 0; i < nums.length; i++) {
    const n1 = nums[i];
    for (let j = i + 1; j < nums.length; j++) {
      const n2 = nums[j];
      for (let k = j + 1; k < nums.length; k++) {
        const n3 = nums[k];
        if (n1 + n2 + n3 === 2020) {
          return n1 * n2 * n3;
        }
      }
    }
  }

  throw 'no part2 answer';
}
