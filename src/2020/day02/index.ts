// https://adventofcode.com/2020/day/2

import { readFileSync } from 'fs';

type PassData = {
  char: string;
  min: number;
  max: number;
  pass: string;
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const passData = parseInput(inputLines);

  return {
    part1: passData.filter(isPassValidForPart1).length,
    part2: passData.filter(isPassValidForPart2).length,
  };
}

function parseInput(inputLines: string[]): PassData[] {
  return inputLines.map((line) => {
    const [numsPart, charPart, pass] = line.split(' ');
    const [min, max] = numsPart.split('-').map(Number);
    const [char] = charPart.split(':');

    return {
      char,
      min,
      max,
      pass,
    };
  });
}

function isPassValidForPart1({ char, min, max, pass }: PassData) {
  const charCount = pass.split('').filter((c) => c === char).length;
  return charCount >= min && charCount <= max;
}

function isPassValidForPart2({ char, min, max, pass }: PassData) {
  const first = pass[min - 1] === char;
  const second = pass[max - 1] === char;
  return (first && !second) || (!first && second);
}
