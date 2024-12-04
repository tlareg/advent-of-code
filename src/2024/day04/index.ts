// https://adventofcode.com/2024/day/4

import { readFileSync } from 'fs';

const DIRECTIONS = [
  'Top',
  'TopRight',
  'Right',
  'BottomRight',
  'Bottom',
  'BottomLeft',
  'Left',
  'TopLeft',
] as const;

type Direction = (typeof DIRECTIONS)[number];

type Position = {
  y: number;
  x: number;
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  return {
    part1: solvePart1(inputLines),
    part2: solvePart2(inputLines),
  };
}

function solvePart1(matrix: string[]): number {
  let count = 0;

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      count += countXmasLinesAtPosition(matrix, { y, x });
    }
  }

  return count;
}

function countXmasLinesAtPosition(
  matrix: string[],
  { y, x }: Position
): number {
  return DIRECTIONS.reduce(
    (count, direction) =>
      isXmasInLine(matrix, { y, x }, direction) ? count + 1 : count,
    0
  );
}

function isXmasInLine(
  matrix: string[],
  position: Position,
  direction: Direction
): boolean {
  const XMAS = 'XMAS';

  let currentPosition: Position = position;
  let currentChar: string | undefined = getCharAtPosition(matrix, currentPosition);

  for (let i = 0; i < XMAS.length; i++) {
    if (currentChar !== XMAS[i]) {
      return false;
    }

    currentPosition = nextPositionInLine(currentPosition, direction);
    currentChar = getCharAtPosition(matrix, currentPosition);
  }

  return true;
}

function nextPositionInLine(
  { y, x }: Position,
  direction: Direction
): Position {
  if (direction === 'Top') return { y: y - 1, x };
  if (direction === 'TopRight') return { y: y - 1, x: x + 1 };
  if (direction === 'Right') return { y, x: x + 1 };
  if (direction === 'BottomRight') return { y: y + 1, x: x + 1 };
  if (direction === 'Bottom') return { y: y + 1, x };
  if (direction === 'BottomLeft') return { y: y + 1, x: x - 1 };
  if (direction === 'Left') return { y, x: x - 1 };
  if (direction === 'TopLeft') return { y: y - 1, x: x - 1 };

  return { y, x };
}

function getCharAtPosition(matrix: string[], position: Position) {
  return matrix[position.y]?.[position.x];
}

function solvePart2(matrix: string[]) {
  let count = 0;

  for (let y = 1; y < matrix.length - 1; y++) {
    for (let x = 1; x < matrix[y].length - 1; x++) {
      if (isXmaxXAtPosition(matrix, { y, x })) {
        count++;
      }
    }
  }

  return count;
}

function isXmaxXAtPosition(matrix: string[], position: Position) {
  const middle = getCharAtPosition(matrix, position);
  const topLeft = getCharAtPosition(
    matrix,
    nextPositionInLine(position, 'TopLeft')
  );
  const bottomRight = getCharAtPosition(
    matrix,
    nextPositionInLine(position, 'BottomRight')
  );
  const topRight = getCharAtPosition(
    matrix,
    nextPositionInLine(position, 'TopRight')
  );
  const bottomLeft = getCharAtPosition(
    matrix,
    nextPositionInLine(position, 'BottomLeft')
  );

  return (
    middle === 'A' &&
    ((topLeft === 'M' && bottomRight === 'S') ||
      (topLeft === 'S' && bottomRight === 'M')) &&
    ((topRight === 'M' && bottomLeft === 'S') ||
      (topRight === 'S' && bottomLeft === 'M'))
  );
}
