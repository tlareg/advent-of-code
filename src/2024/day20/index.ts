// https://adventofcode.com/2024/day/20

import { readFileSync } from 'fs';
import { getNeighbors, Grid, posId, Position } from '../../lib';

type Path = Map<string, Position & { steps: number }>;

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const { grid, start, end } = parseInput(inputLines);

  const path = findPath(grid, start, end);

  return {
    part1: solvePart(path, 2),
    part2: solvePart(path, 20),
  };
}

function parseInput(inputLines: string[]) {
  const grid: Grid<string> = inputLines.map((l) => l.split(''));

  let start: Position | undefined = undefined;
  let end: Position | undefined = undefined;

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === 'S') {
        start = { y, x };
      }

      if (row[x] === 'E') {
        end = { y, x };
      }
    }
  }

  if (!start) throw 'no start point';
  if (!end) throw 'no end point';

  return { grid, start, end };
}

function findPath<T>(grid: Grid<T>, start: Position, end: Position): Path {
  const endPosId = posId(end);
  const path = new Map<string, Position & { steps: number }>();

  let steps = 0;
  path.set(posId(start), { ...start, steps });

  const queue: Position[] = [start];

  while (queue.length) {
    const currentPos = queue.shift()!;

    if (posId(currentPos) === endPosId) {
      return path;
    }

    getNeighbors({
      grid,
      currentPos,
      isNeighborAllowed: (value, pos) => value !== '#' && !path.has(posId(pos)),
    }).forEach((pos: Position) => {
      steps++;
      path.set(posId(pos), { ...pos, steps });
      queue.push(pos);
    });
  }

  return path;
}

function solvePart(path: Path, maxCheatTime: number) {
  const cheats = findCheats(path, maxCheatTime);
  const numOfCheatsBySavedSteps = cheats.reduce<Record<number, number>>(
    (acc, savedSteps) => {
      if (acc[savedSteps] === undefined) {
        acc[savedSteps] = 0;
      }

      acc[savedSteps]++;

      return acc;
    },
    {}
  );

  const countOfCheatsWithOver100StepsSaved = Object.entries(
    numOfCheatsBySavedSteps
  ).reduce((sum, [savedSteps, numberOfCheats]) => {
    if (Number(savedSteps) >= 100) {
      sum += numberOfCheats;
    }
    return sum;
  }, 0);

  return countOfCheatsWithOver100StepsSaved;
}

function findCheats(pathMap: Path, maxCheatTime: number) {
  const pathArr = [...pathMap.values()];
  const cheats = [];

  for (let i = 0; i < pathArr.length - 1; i++) {
    for (let j = i + 1; j < pathArr.length; j++) {
      const posA = pathArr[i];
      const posB = pathArr[j];
      const stepsSaved = posB.steps - posA.steps;
      const distance = Math.abs(posA.x - posB.x) + Math.abs(posA.y - posB.y);

      if (distance > maxCheatTime) {
        continue;
      }

      const saved = stepsSaved - distance;
      if (saved > 0) {
        cheats.push(saved);
      }
    }
  }

  return cheats;
}
