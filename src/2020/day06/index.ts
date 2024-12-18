// https://adventofcode.com/2020/day/6

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const groups = parseInput(inputLines);

  return {
    part1: getDistinctYesByGroupCounts(groups).reduce((sum, n) => sum + n, 0),
    part2: getYesByEveryoneInGroupCounts(groups).reduce((sum, n) => sum + n, 0),
  };
}

function parseInput(inputLines: string[]) {
  const groups: string[][][] = [[]];
  let groupIdx = 0;

  for (let i = 0; i < inputLines.length; i++) {
    const line = inputLines[i];
    if (line === '') {
      groupIdx++;
      groups[groupIdx] = [];
      continue;
    }

    groups[groupIdx].push(line.split(''));
  }

  return groups;
}

function getDistinctYesByGroupCounts(groups: string[][][]): number[] {
  return groups.map((group) => new Set(group.flatMap((x) => x)).size);
}

function getYesByEveryoneInGroupCounts(groups: string[][][]): number[] {
  return groups.map((group) => {
    const firstPerson = group[0];
    let intersection = new Set(firstPerson);

    for (let i = 1; i < group.length; i++) {
      const person = group[i];
      intersection = new Set(
        [...intersection].filter((a) => person.includes(a))
      );
    }

    return intersection.size;
  });
}
