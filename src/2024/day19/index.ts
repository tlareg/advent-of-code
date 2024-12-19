// https://adventofcode.com/2024/day/19

import { readFileSync } from 'fs';

type TowelsData = {
  possibleTowels: string[];
  designs: string[];
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const inputData = parseInput(inputLines);

  return {
    part1: solvePart1(inputData),
    part2: solvePart2(inputData),
  };
}

function parseInput(inputLines: string[]): TowelsData {
  const possibleTowels = inputLines[0].split(',').map((s) => s.trim());
  const designs = inputLines.slice(2);

  return {
    possibleTowels,
    designs,
  };
}

function solvePart1({ possibleTowels, designs }: TowelsData) {
  return designs.reduce(
    (sum, design) =>
      !!countPossibleWays(design, possibleTowels) ? sum + 1 : sum,
    0
  );
}

function solvePart2({ possibleTowels, designs }: TowelsData) {
  return designs.reduce(
    (sum, design) => sum + countPossibleWays(design, possibleTowels),
    0
  );
}

export function countPossibleWays(
  design: string,
  possibleTowels: string[]
): number {
  const cache = new Map<string, number>();
  return _countPossibleWays(design, possibleTowels, cache);
}

function _countPossibleWays(
  design: string,
  possibleTowels: string[],
  cache: Map<string, number>
): number {
  const cacheKey = JSON.stringify(design);

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  if (design.length === 0) {
    return 1;
  }

  const count = possibleTowels
    .filter((towel) => design.startsWith(towel))
    .reduce(
      (count, towel) =>
        count +
        _countPossibleWays(design.slice(towel.length), possibleTowels, cache),
      0
    );

  cache.set(cacheKey, count);

  return count;
}
