// https://adventofcode.com/2023/day/3

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.split('\n');
}

function solve(inputLines: string[]) {
  let sum = 0;
  let gears: { [gearCoords in string]: number[] } = {};

  for (let lineIndex = 0; lineIndex <= inputLines.length; lineIndex++) {
    const numberRegex = /(\d+)/gim;
    const line = inputLines[lineIndex];

    let match = null;
    while ((match = numberRegex.exec(line))) {
      const numStr = match[0];
      const numIndex = match.index;

      const adjacentChars = getAdjacentChars(
        numStr,
        numIndex,
        inputLines,
        lineIndex
      );

      const isPartNumber = adjacentChars.all.some(
        (char) => char !== '.' && !isDigit(char)
      );

      if (isPartNumber) {
        const num = parseInt(numStr, 10);
        sum += num;

        const isGearPart = adjacentChars.all.some((char) => char === '*');
        if (isGearPart) {
          gears = updateGears(gears, num, numIndex, lineIndex, adjacentChars);
        }
      }
    }
  }

  const part2 = Object.values(gears).reduce((acc, nums) => {
    if (nums.length < 2) {
      return acc;
    }
    acc += nums.reduce((acc2, n) => acc2 * n, 1);
    return acc;
  }, 0);

  return { part1: sum, part2 };
}

function getAdjacentChars(
  num: string,
  index: number,
  inputLines: string[],
  lineIndex: number
) {
  const topChars = inputLines[lineIndex - 1]
    ? inputLines[lineIndex - 1]
        .slice(
          index === 0 ? 0 : index - 1,
          Math.min(index + num.length + 1, inputLines[lineIndex].length)
        )
        .split('')
    : [];

  const leftChar = inputLines[lineIndex][index - 1];

  const rightChar = inputLines[lineIndex][index + num.length];

  const bottomChars = inputLines[lineIndex + 1]
    ? inputLines[lineIndex + 1]
        .slice(
          index === 0 ? 0 : index - 1,
          Math.min(index + num.length + 1, inputLines[lineIndex].length)
        )
        .split('')
    : [];

  return {
    topChars,
    leftChar,
    rightChar,
    bottomChars,
    all: [...topChars, leftChar, rightChar, ...bottomChars].filter(Boolean),
  };
}

function isDigit(char: string) {
  return !isNaN(parseInt(char, 10));
}

function updateGears(
  gears: { [gearCoords in string]: number[] },
  num: number,
  numIndex: number,
  lineIndex: number,
  adjacentChars: {
    topChars: string[];
    bottomChars: string[];
    leftChar: string;
    rightChar: string;
    all: string[];
  }
) {
  let gearCoords = '';

  if (adjacentChars.leftChar === '*') {
    gearCoords = `${numIndex - 1},${lineIndex}`;
    gears[gearCoords] = [...(gears[gearCoords] || []), num];
  }

  if (adjacentChars.rightChar === '*') {
    gearCoords = `${numIndex + `${num}`.length},${lineIndex}`;
    gears[gearCoords] = [...(gears[gearCoords] || []), num];
  }

  if (adjacentChars.topChars.includes('*')) {
    gearCoords = `${
      Math.max(numIndex - 1, 0) + adjacentChars.topChars.indexOf('*')
    },${lineIndex - 1}`;
    gears[gearCoords] = [...(gears[gearCoords] || []), num];
  }

  if (adjacentChars.bottomChars.includes('*')) {
    gearCoords = `${
      Math.max(numIndex - 1, 0) + adjacentChars.bottomChars.indexOf('*')
    },${lineIndex + 1}`;
    gears[gearCoords] = [...(gears[gearCoords] || []), num];
  }

  return gears;
}
