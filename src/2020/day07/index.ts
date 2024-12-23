// https://adventofcode.com/2020/day/7

import { readFileSync } from 'fs';

type BagsMap = Record<string, Record<string, number>>;

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const bagsMap = parseInput(inputLines);

  return {
    part1: solvePart1(bagsMap),
    part2: solvePart2(bagsMap),
  };
}

function parseInput(inputLines: string[]) {
  const bagsMap: BagsMap = {};

  for (const line of inputLines) {
    const match = line.match(
      /(?<containerColor>\w+ \w+) bags contain (?<bags>.+)\./
    );

    if (match && match.groups) {
      const { containerColor, bags } = match.groups;

      bags.split(',').forEach((containedBagStr) => {
        const match = containedBagStr.match(
          /(?<count>\d+)\s+(?<color>\w+ \w+)/
        );
        if (!match || !match.groups) {
          return false;
        }

        const { count, color } = match.groups;

        if (!bagsMap[containerColor]) {
          bagsMap[containerColor] = {};
        }

        bagsMap[containerColor][color] = Number(count);
      });
    }
  }

  return bagsMap;
}

function solvePart1(bagsMap: BagsMap) {
  let sum = 0;
  let colorsCount = 0;

  Object.keys(bagsMap).forEach((color) => {
    const count = getShinyGoldCount(bagsMap, color);
    if (count > 0) {
      colorsCount++;
      sum += count;
    }
  });

  return { colorsCount, sum };
}

function getShinyGoldCount(bagsMap: BagsMap, color: string): number {
  let sum = 0;

  const colorData = bagsMap[color];
  if (!colorData) {
    return 0;
  }

  Object.keys(colorData).forEach((color) => {
    if (color === 'shiny gold') {
      sum += colorData[color];
    }

    sum += getShinyGoldCount(bagsMap, color);
  });

  return sum;
}

function solvePart2(bagsMap: BagsMap) {
  return sumBags(bagsMap, 'shiny gold');
}

function sumBags(bagsMap: BagsMap, color: string): number {
  if (!bagsMap[color]) {
    return 0;
  }

  return Object.entries(bagsMap[color]).reduce((sum, [color, count]) => {
    return sum + count + count * sumBags(bagsMap, color);
  }, 0);
}
