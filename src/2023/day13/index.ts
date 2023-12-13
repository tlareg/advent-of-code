// https://adventofcode.com/2023/day/13

import { readFileSync } from 'fs';

const solution = solve(readInput(`${__dirname}/input.txt`));
console.log(solution);

type Pattern = string[][];

function readInput(inputFilePath: string) {
  return readFileSync(inputFilePath, 'utf-8')
    .split('\n')
    .reduce<Pattern[]>(
      (patterns, line) => {
        if (line.trim() === '') {
          patterns.push([]);
        } else {
          patterns[patterns.length - 1].push(line.split(''));
        }
        return patterns;
      },
      [[]]
    );
}

function solve(patterns: Pattern[]) {
  return {
    part1: getAnswer(patterns, 0),
    part2: getAnswer(patterns, 1),
  };
}

function getAnswer(patterns: Pattern[], expectedDiffs: number) {
  return sumReflectionLines(
    patterns.map((pattern) => findReflectionLine(pattern, expectedDiffs))
  );
}

function sumReflectionLines(
  reflectionLines: {
    idx: number;
    isVertical: boolean;
  }[]
) {
  return reflectionLines.reduce(
    (acc, { idx, isVertical }) =>
      acc + (isVertical ? idx + 1 : (idx + 1) * 100),
    0
  );
}

function findReflectionLine(
  pattern: Pattern,
  expectedDiffs: number
): {
  idx: number;
  isVertical: boolean;
} {
  let isVertical = false;
  let reflectionLine = findReflectionLineOfType(
    pattern,
    isVertical,
    expectedDiffs
  );
  if (reflectionLine) {
    return { idx: reflectionLine.idx, isVertical };
  }

  isVertical = true;
  reflectionLine = findReflectionLineOfType(pattern, isVertical, expectedDiffs);
  if (reflectionLine) {
    return { idx: reflectionLine.idx, isVertical };
  }

  displayPattern(pattern);

  throw 'no reflection line found';
}

function findReflectionLineOfType(
  pattern: Pattern,
  isVertical: boolean,
  expectedDiffs: number
): { idx: number; diffsCount: number } | undefined {
  return findEqualLines(pattern, isVertical, expectedDiffs).find(
    ({ idx, diffsCount }) =>
      isReflectionLine(idx, diffsCount, pattern, isVertical, expectedDiffs)
  );
}

function findEqualLines(
  pattern: Pattern,
  isVertical: boolean,
  expectedDiffs: number
): Array<{ idx: number; diffsCount: number }> {
  const lines = isVertical ? getColumns(pattern) : pattern;

  return lines.reduce<Array<{ idx: number; diffsCount: number }>>(
    (equalPairIndices, line, i) => {
      const nextLine = lines[i + 1];
      if (!nextLine) {
        return equalPairIndices;
      }

      const diffsCount = countDiffs(line, nextLine);

      if ([0, expectedDiffs].includes(diffsCount)) {
        equalPairIndices.push({ idx: i, diffsCount });
      }

      return equalPairIndices;
    },
    []
  );
}

function isReflectionLine(
  lineIndex: number,
  diffsCount: number,
  pattern: Pattern,
  isVertical: boolean,
  expectedDiffs: number
) {
  let patternDiffsCount = diffsCount;
  let offset = 1;

  const lines = isVertical ? getColumns(pattern) : pattern;
  const nextLeft = (offset: number) => lines[lineIndex - offset];
  const nextRight = (offset: number) => lines[lineIndex + 1 + offset];

  let leftLine = nextLeft(offset);
  let rightLine = nextRight(offset);

  while (!!leftLine && !!rightLine) {
    patternDiffsCount += countDiffs(leftLine, rightLine);
    offset++;
    leftLine = nextLeft(offset);
    rightLine = nextRight(offset);
  }

  return patternDiffsCount === expectedDiffs;
}

function countDiffs(lineA: string[], lineB: string[]): number {
  return lineA.reduce(
    (diffsCount, a, i) => (a === lineB[i] ? diffsCount : diffsCount + 1),
    0
  );
}

function getColumns(pattern: Pattern) {
  return pattern[0].map((_char, colIdx) => pattern.map((row) => row[colIdx]));
}

function display(patterns: Pattern[]) {
  patterns.forEach((pattern) => {
    console.log('\n---------------------------\n');
    displayPattern(pattern);
  });
}

function displayPattern(pattern: Pattern) {
  pattern.forEach((row) => {
    console.log(row.join(''));
  });
}
