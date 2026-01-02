// https://adventofcode.com/2025/day/3

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  return {
    part1: solvePart(inputLines, 2),
    part2: solvePart(inputLines, 12),
  };
}

function solvePart(inputLines: string[], numOfDigits: number) {
  return inputLines
    .map((line) => computeBankJoltage(line, numOfDigits))
    .reduce((sum, n) => sum + n, 0);
}

function computeBankJoltage(line: string, numOfDigits: number): number {
  let nextDigit: number;
  let digitIndex: number = -1;

  const digits: number[] = [];
  const sourceDigits = [...line].map((n) => Number(n));

  while (digits.length < numOfDigits) {
    const sliceStart = digitIndex + 1;
    // reserve some digits at the end to ensure that all remaining digits will be filled
    const sliceEnd = -(numOfDigits - 1 - digits.length) || undefined;

    const possibleDigits = sourceDigits.slice(sliceStart, sliceEnd);

    nextDigit = Math.max(...possibleDigits);
    digits.push(nextDigit);
    digitIndex = sliceStart + possibleDigits.indexOf(nextDigit);
  }

  return Number(digits.join(''));
}
