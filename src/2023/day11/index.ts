// https://adventofcode.com/2023/day/11

import { readFileSync } from 'fs';

type Image = string[][];

type Galaxy = { x: number; y: number };

type EmptySpace = {
  rows: Set<number>;
  cols: Set<number>;
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const image = inputLines.map((n) => n.split(''));
  const emptySpace = getEmptySpace(image);
  const galaxies = findGalaxies(image);
  const part1Distances = getDistances({
    galaxies,
    emptySpace,
    expansionRate: 2,
  });
  const part2Distances = getDistances({
    galaxies,
    emptySpace,
    expansionRate: 1000000,
  });

  return {
    part1: sum(part1Distances),
    part2: sum(part2Distances),
  };
}

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

function getEmptySpace(image: Image): EmptySpace {
  return {
    rows: image.reduce((acc, row, rowIdx) => {
      if (row.every((n) => n === '.')) {
        acc.add(rowIdx);
      }
      return acc;
    }, new Set<number>()),
    cols: image[0].reduce((acc, _col, colIdx) => {
      if (image.every((row) => row[colIdx] === '.')) {
        acc.add(colIdx);
      }
      return acc;
    }, new Set<number>()),
  };
}

function findGalaxies(image: Image): Galaxy[] {
  const galaxies = [];
  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[y].length; x++) {
      if (image[y][x] === '#') {
        galaxies.push({ x, y });
      }
    }
  }
  return galaxies;
}

function getDistances({
  galaxies,
  emptySpace,
  expansionRate,
}: {
  galaxies: Galaxy[];
  emptySpace: EmptySpace;
  expansionRate: number;
}): number[] {
  const distances: number[] = [];

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      distances.push(
        getDistance(galaxies[i], galaxies[j], emptySpace, expansionRate)
      );
    }
  }

  return distances;
}

function getDistance(
  a: Galaxy,
  b: Galaxy,
  emptySpace: EmptySpace,
  expansionRate: number
) {
  const baseDistance = getBaseDistance(a, b);

  const emptySpaceCount = [
    { emptyIndicesSet: emptySpace.rows, dimension: 'y' as const },
    { emptyIndicesSet: emptySpace.cols, dimension: 'x' as const },
  ].reduce(
    (sum, { emptyIndicesSet, dimension }) =>
      sum + countEmptySpaceBetween(a, b, emptyIndicesSet, dimension),
    0
  );

  return baseDistance + emptySpaceCount * (expansionRate - 1);
}

function getBaseDistance(a: Galaxy, b: Galaxy) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function countEmptySpaceBetween(
  a: Galaxy,
  b: Galaxy,
  emptyIndicesSet: Set<number>,
  dimension: 'x' | 'y'
) {
  let count = 0;
  let minIdx = Math.min(a[dimension], b[dimension]);
  let maxIdx = Math.max(a[dimension], b[dimension]);

  for (let idx = minIdx + 1; idx < maxIdx; idx++) {
    if (emptyIndicesSet.has(idx)) {
      count++;
    }
  }

  return count;
}
