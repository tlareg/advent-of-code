// https://adventofcode.com/2025/day/2

import { readFileSync } from 'fs';

const solution = solve(readInput(`${__dirname}/input.txt`));
console.log(solution);

function readInput(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split(',');
}

function solve(input: string[]) {
  const ranges = input.map((rangeStr) => rangeStr.split('-').map(Number));

  let part1 = 0;
  let part2 = 0;

  for (const [min, max] of ranges) {
    for (let i = min; i <= max; i++) {
      const numStr = `${i}`;
      if (/^(\d+)\1$/.test(numStr)) {
        part1 += i;
      }
      if (/^(\d+)\1+$/.test(numStr)) {
        part2 += i;
      }
    }
  }

  return {
    part1,
    part2,
  };
}
