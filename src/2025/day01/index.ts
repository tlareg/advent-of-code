// https://adventofcode.com/2025/day/1

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  console.log(inputLines);
  return {
    part1: undefined,
  };
}
