// https://adventofcode.com/2024/day/3

import { readFileSync } from 'fs';

const solution = solve(readInput(`${__dirname}/input.txt`));
console.log(solution);

function readInput(inputFilePath: string) {
  return readFileSync(inputFilePath, 'utf-8');
}

function solve(input: string) {
  return {
    part1: solvePart1(input),
    part2: solvePart2(input),
  };
}

function solvePart1(input: string) {
  const mulRegex = /(mul\(\d+,\d+\))/g;

  return Array.from(input.matchAll(mulRegex))
    .map((match) => match[0].match(/\d+/g)?.map(Number)!)
    .reduce((sum, [a, b]) => sum + a * b, 0);
}

function solvePart2(input: string) {
  const doParts = input.split('do()')
  const onlyDoParts = doParts.map((doPart) => doPart.split("don't()")[0]);

  return onlyDoParts.map(solvePart1).reduce((sum, x) => sum + x, 0);
}
