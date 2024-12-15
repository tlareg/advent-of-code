// https://adventofcode.com/2024/day/15

import { readFileSync } from 'fs';

type Map = string[][];

type Moves = string[];

type Point = {
  y: number;
  x: number;
};

type State = {
  map: Map;
  moves: Moves;
  currentPoint: Point;
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  let state = parseInput(inputLines);
  runMoves(state);

  return {
    part1: getGPSCoordsSum(state),
  };
}

function parseInput(inputLines: string[]): State {
  const map: Map = [];
  const moves: Moves = [];

  for (let i = 0; i < inputLines.length; i++) {
    const line = inputLines[i];
    if (line.startsWith('#')) {
      map.push(line.split(''));
      continue;
    }

    if (line[i] !== '') {
      moves.push(...line);
    }
  }

  const currentPoint = findStart(map);

  return { map, moves, currentPoint };
}

function iterateMap(
  map: Map,
  callback: ({ y, x }: Point, value: string) => boolean | void
): void {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const value = row[x];
      const shouldBreak = callback({ y, x }, value) ?? false;
      if (shouldBreak) {
        return;
      }
    }
  }
}

function displayMap(map: Map) {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    console.log(row.join(''));
  }
  console.log('\n');
}

function findStart(map: Map): Point {
  let start: Point = { y: 0, x: 0 };

  iterateMap(map, (point, value) => {
    if (value === '@') {
      start = point;
      return true;
    }
  });

  return start;
}

function runMoves(state: State) {
  for (let i = 0; i < state.moves.length; i++) {
    tryMove(state, i);
  }
}

function tryMove(state: State, moveIdx: number) {
  const pointsTillFreeSpace = getPointsTillFreeSpace(state, moveIdx);

  if (!pointsTillFreeSpace.length) {
    return;
  }

  move(state, pointsTillFreeSpace);
}

function move(state: State, pointsTillFreeSpace: Point[]) {
  if (!pointsTillFreeSpace.length) {
    return;
  }

  const [robotPoint, nextRobotPoint] = pointsTillFreeSpace;
  state.map[robotPoint.y][robotPoint.x] = '.';
  state.map[nextRobotPoint.y][nextRobotPoint.x] = '@';
  state.currentPoint = nextRobotPoint;

  // nextRobotPoint === freeSpacePoint
  if (pointsTillFreeSpace.length === 2) {
    return;
  }

  const freeSpacePoint = pointsTillFreeSpace[pointsTillFreeSpace.length - 1];
  state.map[freeSpacePoint.y][freeSpacePoint.x] = 'O';
}

function vectorByMove(move: string): Point {
  if (move === '^') return { y: -1, x: 0 };
  if (move === 'v') return { y: 1, x: 0 };
  if (move === '>') return { y: 0, x: 1 };
  if (move === '<') return { y: 0, x: -1 };
  throw 'unknown move';
}

function getNextPoint({ y, x }: Point, move: string) {
  const vector = vectorByMove(move);
  return { y: y + vector.y, x: x + vector.x };
}

function getPointsTillFreeSpace(state: State, moveIdx: number): Point[] {
  const currentMove = state.moves[moveIdx];
  let point = state.currentPoint;
  let currentValue;
  let pointsToMove: Point[] = [point];

  while (true) {
    point = getNextPoint(point, currentMove);
    currentValue = state.map[point.y]?.[point.x];

    if (currentValue === '#') {
      return [];
    }

    if (currentValue === '.') {
      pointsToMove.push(point);
      return pointsToMove;
    }

    if (currentValue === 'O') {
      pointsToMove.push(point);
      continue;
    }

    return [];
  }
}

function getGPSCoordsSum(state: State): number {
  let sum = 0;

  iterateMap(state.map, ({ x, y }, value) => {
    if (value === 'O') {
      sum += 100 * y + x;
    }
  });

  return sum;
}
