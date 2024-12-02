// https://adventofcode.com/2024/day/2

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const reports = inputLines.map((line) => line.match(/\d+/g)?.map(Number)!);
  return {
    part1: reports.filter((report) => isSafeForPart1(report)).length,
    part2: reports.filter((report) => isSafeForPart2(report)).length,
  };
}

function isSafeForPart1(report: number[]): boolean {
  let reportDirection: 'inc' | 'dec' | undefined;

  for (let i = 1; i < report.length; i++) {
    const level = report[i];
    const prevLevel = report[i - 1];
    const diff = Math.abs(level - prevLevel);

    if (diff < 1 || diff > 3 || level === prevLevel) {
      return false;
    }

    const currentItemsDirection = level > prevLevel ? 'inc' : 'dec';
    if (!reportDirection) {
      reportDirection = currentItemsDirection;
      continue;
    }

    if (reportDirection !== currentItemsDirection) {
      return false;
    }
  }

  return true;
}

export function isSafeForPart2(report: number[]): boolean {
  if (isSafeForPart1(report)) {
    return true;
  }

  for (let i = 0; i < report.length; i++) {
    const newReport = removeAtIndex(report, i);
    if (isSafeForPart1(newReport)) {
      return true;
    }
  }

  return false;
}

function removeAtIndex<T>(arr: T[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
