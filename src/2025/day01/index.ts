// https://adventofcode.com/2025/day/1

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  let currentVal = 50;
  let zeroCount = 0;

  for (const rotation of inputLines) {
    currentVal = applyRotation(currentVal, rotation);
    if (currentVal === 0) {
      zeroCount++;
    }
  }

  return {
    part1: zeroCount,
  };
}

function applyRotation(currentVal: number, rotation: string): number {
  const { dir, value } = rotation.match(/^(?<dir>R|L)(?<value>\d+)$/)
    ?.groups as { dir: string; value: string };

  const n = parseInt(value, 10);

  if (dir === 'R') {
    return normalize(currentVal + n);
  }

  if (dir === 'L') {
    return normalize(currentVal - n);
  }

  throw 'Invalid dir';
}

function normalize(val: number): number {
  return ((val % 100) + 100) % 100;
}
