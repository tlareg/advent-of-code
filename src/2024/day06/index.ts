// https://adventofcode.com/2024/day/6

import { readFileSync } from 'fs';

const DIRECTIONS = ['Top', 'Right', 'Bottom', 'Left'] as const;

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

function solve(map: string[]) {
  return {
    part1: solvePart1(map),
    part2: solvePart2(map),
  };
}

function solvePart1(map: string[]) {
  let position: Position = findStartingPosition(map);
  let prevPosition: Position = position;
  let direction: Direction = 'Top';
  let value: string | undefined = '^';

  const visitedPositions = new Set<string>();

  while (value !== undefined) {
    visitedPositions.add(`${position.y},${position.x}`);
    prevPosition = position;
    position = getNextPosition(position, direction);
    value = getValueAtPosition(map, position);

    if (value === '#') {
      direction = rotate90Right(direction);
      position = prevPosition;
    }
  }

  return visitedPositions.size;
}

function findStartingPosition(map: string[]): Position {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const val = row[x];
      if (val === '^') {
        return { y, x };
      }
    }
  }

  throw 'starting position missing';
}

function getNextPosition({ y, x }: Position, direction: Direction): Position {
  if (direction === 'Top') return { y: y - 1, x };
  if (direction === 'Right') return { y, x: x + 1 };
  if (direction === 'Bottom') return { y: y + 1, x };
  if (direction === 'Left') return { y, x: x - 1 };

  return { y, x };
}

function getValueAtPosition(
  map: string[],
  { y, x }: Position
): string | undefined {
  return map[y]?.[x];
}

function rotate90Right(direction: Direction): Direction {
  return DIRECTIONS[(DIRECTIONS.indexOf(direction) + 1) % DIRECTIONS.length];
}

function solvePart2(map: string[]): number {
  let validObstructionsCount = 0;

  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === '.' && isLoop(placeObstruction(map, { y, x }))) {
        validObstructionsCount++;
      }
    }
  }

  return validObstructionsCount;
}

function placeObstruction(map: string[], { y, x }: Position): string[] {
  const newMap = [...map];
  const row = newMap[y];

  newMap[y] = row.slice(0, x) + '#' + row.slice(x + 1);

  return newMap;
}

function isLoop(map: string[]): boolean {
  let position: Position = findStartingPosition(map);
  let prevPosition: Position = position;
  let direction: Direction = 'Top';
  let value: string | undefined = '^';

  const visitedPositions = new Set<string>();

  while (value !== undefined) {
    const positionAndDirection = `${position.y},${position.x},${direction}`;

    if (visitedPositions.has(positionAndDirection)) {
      return true;
    }

    visitedPositions.add(`${position.y},${position.x},${direction}`);

    prevPosition = position;
    position = getNextPosition(position, direction);
    value = getValueAtPosition(map, position);

    if (value === '#') {
      direction = rotate90Right(direction);
      position = prevPosition;
    }
  }

  return false;
}
