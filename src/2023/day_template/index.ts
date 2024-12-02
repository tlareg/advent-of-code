// https://adventofcode.com/2023/day/x

import { readFileSync } from 'fs';

const solution = solve(readInput(`${__dirname}/test_input.txt`));
// console.log(solution);

function readInput(inputFilePath: string) {
  return readFileSync(inputFilePath, 'utf-8')
    .replace(/\r\n/g, '\n')
    .split('\n');
}

function solve(inputLines: string[]) {
  console.log(inputLines);

  return {
    part1: undefined,
    part2: undefined,
  };
}
