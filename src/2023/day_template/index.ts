// https://adventofcode.com/2023/day/x

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.split('\n');
}

function solve(inputLines: string[]) {
  return {
    part1: undefined,
    part2: undefined,
  };
}
