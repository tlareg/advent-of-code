// https://adventofcode.com/2023/day/1

import { readFileSync } from 'fs';

const SPELLED_DIGITS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.split('\n');
}

function solve(inputLines: string[]) {
  return inputLines.reduce(
    (acc, line) => ({
      part1: acc.part1 + getLineValue(line),
      part2: acc.part2 + getLineValue(line, true),
    }),
    { part1: 0, part2: 0 }
  );
}

function getLineValue(line: string, withSpelledDigits: boolean = false) {
  let firstDigit = undefined;
  let lastDigit = undefined;

  for (let i = 0; i <= line.length; i++) {
    const intParsedChar = parseInt(line[i], 10);
    const digitAtIndex = !isNaN(intParsedChar)
      ? intParsedChar
      : withSpelledDigits
      ? getSpelledDigitAtIndex(line, i)
      : false;

    if (digitAtIndex) {
      if (!firstDigit) {
        firstDigit = digitAtIndex;
      } else {
        lastDigit = digitAtIndex;
      }
    }
  }

  if (!lastDigit) {
    lastDigit = firstDigit;
  }

  return parseInt(`${firstDigit}${lastDigit}`, 10) || 0;
}

function getSpelledDigitAtIndex(line: string, index: number) {
  const remainingLinePart = line.slice(index);

  for (const spelledDigit of SPELLED_DIGITS) {
    if (remainingLinePart.startsWith(spelledDigit)) {
      return SPELLED_DIGITS.indexOf(spelledDigit) + 1;
    }
  }

  return false;
}
