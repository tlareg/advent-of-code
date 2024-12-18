// https://adventofcode.com/2024/day/18

import { readFileSync } from 'fs';

const DIRS = {
  N: { y: -1, x: 0 },
  S: { y: 1, x: 0 },
  E: { y: 0, x: 1 },
  W: { y: 0, x: -1 },
} as const;

type Position = {
  y: number;
  x: number;
};

type Grid = string[][];

const GRID_SIZE = 71;
const BYTES_COUNT = 1024;
const INPUT_FILE_PATH = `${__dirname}/input.txt`;

// const GRID_SIZE = 7;
// const BYTES_COUNT = 12;
// const INPUT_FILE_PATH = `${__dirname}/test_input.txt`;

const solution = solve(readLines(INPUT_FILE_PATH));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const corruptedCoords = parseInput(inputLines);

  return {
    part1: solvePart1(corruptedCoords),
    part2: solvePart2(corruptedCoords),
  };
}

function parseInput(inputLines: string[]): Position[] {
  return inputLines.map((line) => {
    const [x, y] = line.split(',');

    return {
      y: Number(y),
      x: Number(x),
    };
  });
}

function solvePart1(corruptedCoords: Position[]): number | undefined {
  const start: Position = { y: 0, x: 0 };
  const end: Position = { y: GRID_SIZE - 1, x: GRID_SIZE - 1 };
  const grid = createGrid(GRID_SIZE, corruptedCoords, BYTES_COUNT);
  return bfs(grid, start, ({ y, x }) => end.y == y && end.x == x);
}

function solvePart2(corruptedCoords: Position[]) {
  const start: Position = { y: 0, x: 0 };
  const end: Position = { y: GRID_SIZE - 1, x: GRID_SIZE - 1 };

  const bfsForBytesCount = (bytesCount: number) => {
    const grid = createGrid(GRID_SIZE, corruptedCoords, bytesCount);
    return bfs(grid, start, ({ y, x }) => end.y == y && end.x == x);
  };

  const binarySearchCheck = (bytesCount: number): -1 | 0 | 1 => {
    const curr = bfsForBytesCount(bytesCount);
    const prev = bfsForBytesCount(bytesCount - 1);

    if (curr === undefined && prev !== undefined) {
      return 0;
    }

    if (curr === undefined && prev === undefined) {
      return 1;
    }

    return -1;
  };

  const firstBlockingBytesCount = binarySearch(corruptedCoords.length - 1, binarySearchCheck)!;
  const firstBlockingCoords = corruptedCoords[firstBlockingBytesCount - 1];

  return `${firstBlockingCoords.x},${firstBlockingCoords.y}`;
}

function createGrid(
  gridSize: number,
  corruptedCoords: Position[],
  bytesCount: number
): Grid {
  const grid: Grid = [];

  for (let y = 0; y < gridSize; y++) {
    grid[y] = [];
    for (let x = 0; x < gridSize; x++) {
      grid[y][x] = '.';
    }
  }

  for (let i = 0; i < bytesCount; i++) {
    const { y, x } = corruptedCoords[i];
    grid[y][x] = '#';
  }

  return grid;
}

function bfs(
  grid: Grid,
  start: Position,
  isGoal: (pos: Position) => boolean
): number | undefined {
  const visited = new Set<string>();
  visited.add(id(start));

  const queue: Position[] = [start];
  let steps = 0;

  while (queue.length) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const currPos = queue.shift()!;

      if (isGoal(currPos)) {
        return steps;
      }

      getNeighbors(grid, currPos).forEach((pos: Position) => {
        const posId = id(pos);
        if (!visited.has(posId)) {
          visited.add(posId);
          queue.push(pos);
        }
      });
    }

    steps++;
  }
}

function getNeighbors(grid: Grid, { y, x }: Position): Position[] {
  return Object.entries(DIRS)
    .map(([_dir, vector]) => ({
      y: y + vector.y,
      x: x + vector.x,
    }))
    .filter(
      ({ y, x }) =>
        y >= 0 &&
        x >= 0 &&
        y < grid.length &&
        x < grid[0].length &&
        grid[y]?.[x] !== '#'
    );
}

function id({ y, x }: Position) {
  return `${y},${x}`;
}

function displayGrid(grid: Grid) {
  console.log(grid.map((row) => row.join('')).join('\n'));
}

function binarySearch(
  maxIndex: number,
  checkIndex: (index: number) => -1 | 0 | 1
): number | undefined {
  let leftIndex = 0;
  let rightIndex = maxIndex;
  let middleIndex;

  while (leftIndex <= rightIndex) {
    middleIndex = Math.floor((leftIndex + rightIndex) / 2);
    const compareResult = checkIndex(middleIndex);
    if (compareResult === 0) {
      return middleIndex;
    }
    if (compareResult === -1) {
      leftIndex = middleIndex + 1;
    } else if (compareResult === 1) {
      rightIndex = middleIndex - 1;
    }
  }
}
