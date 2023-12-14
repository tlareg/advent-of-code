// https://adventofcode.com/2023/day/x

import { readFileSync } from 'fs';
import { sum } from '../../lib';

const solution = solve(readInput(`${__dirname}/input.txt`));
console.log(solution);

type Pattern = string[][];

type Point = { x: number; y: number };

function readInput(inputFilePath: string): Pattern {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((n) => n.split(''));
}

function solve(pattern: Pattern) {
  const roundedRocks = findRoundedRocks(pattern);
  const shiftedRocks = getShiftedRocks(pattern, roundedRocks);
  const load = getLoad(pattern, shiftedRocks);

  return {
    part1: load,
    part2: undefined,
  };
}

function findRoundedRocks(pattern: Pattern) {
  return reducePattern<Point[]>(
    pattern,
    (roundedRocks, symbol, rowIdx, colIdx) => {
      if (symbol === 'O') {
        roundedRocks.push({ y: rowIdx, x: colIdx });
      }
      return roundedRocks;
    },
    []
  );
}

function getShiftedRocks(pattern: Pattern, roundedRocks: Point[]) {
  const shiftedRocks = [];

  let currentPattern = pattern;
  for (let i = 0; i < roundedRocks.length; i++) {
    const { x, y } = roundedRocks[i];
    const { pattern: newPattern, shiftedRock } = slideRock(currentPattern, {
      x,
      y,
    });
    currentPattern = newPattern;
    shiftedRocks.push(shiftedRock);
  }

  return shiftedRocks;
}

function slideRock(pattern: Pattern, { x, y }: Point) {
  const shiftedRock = { x, y };

  for (let i = y - 1; ; i--) {
    const upperSymbol = i === -1 ? undefined : pattern[i][x];
    if (upperSymbol !== '.') {
      shiftedRock.y = i + 1;
      if (shiftedRock.y !== y) {
        pattern[shiftedRock.y][shiftedRock.x] = 'O';
        pattern[y][x] = '.';
      }
      return { pattern, shiftedRock };
    }
  }
}

function getLoad(pattern: Pattern, shiftedRocks: Point[]) {
  const getRockLoad = (rock: Point) => pattern.length - rock.y;
  return sum(shiftedRocks.map(getRockLoad));
}

function reducePattern<TAcc>(
  pattern: Pattern,
  callback: (acc: TAcc, symbol: string, rowIdx: number, colIdx: number) => TAcc,
  initialAcc: TAcc
) {
  let acc = initialAcc;
  for (let rowIdx = 0; rowIdx < pattern.length; rowIdx++) {
    for (let colIdx = 0; colIdx < pattern[rowIdx].length; colIdx++) {
      acc = callback(acc, pattern[rowIdx][colIdx], rowIdx, colIdx);
    }
  }
  return acc;
}

function displayPattern(pattern: Pattern) {
  console.log('\n---------------------------\n');
  pattern.forEach((row) => {
    console.log(row.join(''));
  });
}
