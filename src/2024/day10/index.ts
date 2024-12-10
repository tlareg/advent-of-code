// https://adventofcode.com/2024/day/10

import { readFileSync } from 'fs';

type Point = {
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
  const startPoints = findStartPoints(map);
  const scoresForPart1 = [];
  const scoresForPart2 = [];

  for (const point of startPoints) {
    const endPoints: Point[] = [];
    findEndPoints(map, point, 0, endPoints);
    scoresForPart1.push(new Set(endPoints.map(({ y, x }) => `${y},${x}`)).size);
    scoresForPart2.push(endPoints.length);
  }

  return {
    part1: scoresForPart1.reduce((sum, score) => sum + score, 0),
    part2: scoresForPart2.reduce((sum, score) => sum + score, 0),
  };
}

function findStartPoints(map: string[]): Point[] {
  const startPoints: Point[] = [];

  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const level = row[x];
      if (level === '0') {
        startPoints.push({ y, x });
      }
    }
  }

  return startPoints;
}

function findEndPoints(
  map: string[],
  currentPoint: Point,
  currentLevel: number,
  endPoints: Point[]
): void {
  const { x, y } = currentPoint;

  if (currentLevel === 9) {
    endPoints.push(currentPoint);
    return;
  }

  const nextLevel = currentLevel + 1;
  const topPoint = { y: y - 1, x };
  const downPoint = { y: y + 1, x };
  const rightPoint = { y, x: x + 1 };
  const leftPoint = { y, x: x - 1 };
  const points = [topPoint, downPoint, rightPoint, leftPoint];

  for (const point of points) {
    const pointLevelRaw = map[point.y]?.[point.x];
    const pointLevel = Number(pointLevelRaw);
    if (pointLevel === nextLevel) {
      findEndPoints(map, point, nextLevel, endPoints);
    }
  }
}
