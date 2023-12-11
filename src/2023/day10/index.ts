// https://adventofcode.com/2023/day/10

import { readFileSync } from 'fs';

type Plan = string[][];

type Point = readonly [number, number];

type Direction = 'top' | 'down' | 'left' | 'right';

type Position = {
  point: Point;
  direction: Direction;
};

// const solution = solve(readLines(`${__dirname}/test_input.txt`));
// const solution = solve(readLines(`${__dirname}/test_input2.txt`));
const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.split('\n');
}

function solve(inputLines: string[]) {
  const plan = inputLines.map((line) => line.split(''));
  display(plan);

  return {
    part1: solvePart1(plan),
    part2: undefined,
  };
}

function solvePart1(plan: Plan) {
  const startingPoint = getStartingPoint(plan);

  let currentPositions = getStartingPositions(plan, startingPoint);
  if (currentPositions.length !== 2) {
    throw "there should be 2 starting positions";
  }

  let stepsCount = 1;

  while (!areEqual(currentPositions[0].point, currentPositions[1].point)) {
    currentPositions = currentPositions.map((position) =>
      getNextPosition(getVal(plan, position.point), position)
    );
    stepsCount++;
  }

  return stepsCount;
}

function display(plan: Plan) {
  console.log(plan.map((x) => x.join('')).join('\n'));
}

function getStartingPoint(plan: Plan): [number, number] {
  for (let y = 0; y < plan.length; y++) {
    for (let x = 0; x < plan[y].length; x++) {
      if (plan[y][x] === 'S') {
        return [y, x];
      }
    }
  }
  throw 'no starting point';
}

function getNextPosition(val: string, position: Position): Position {
  const { direction, point } = position;

  if (['-', '|'].includes(val)) {
    return newPosition(direction, point);
  }

  if (direction === 'top') {
    if (val === 'F') {
      return newPosition('right', point);
    }
    if (val === '7') {
      return newPosition('left', point);
    }
  }

  if (direction === 'down') {
    if (val === 'L') {
      return newPosition('right', point);
    }
    if (val === 'J') {
      return newPosition('left', point);
    }
  }

  if (direction === 'right') {
    if (val === 'J') {
      return newPosition('top', point);
    }
    if (val === '7') {
      return newPosition('down', point);
    }
  }

  if (direction === 'left') {
    if (val === 'F') {
      return newPosition('down', point);
    }
    if (val === 'L') {
      return newPosition('top', point);
    }
  }

  throw `unhandled next position (direction: ${direction}, val: ${val})`;
}

function getStartingPositions(plan: Plan, startingPoint: Point): Position[] {
  const positions: Position[] = [];
  const topPoint = top(startingPoint);
  const bottomPoint = down(startingPoint);
  const rightPoint = right(startingPoint);
  const leftPoint = left(startingPoint);

  if (['|', 'F', '7'].includes(getVal(plan, topPoint))) {
    positions.push({
      direction: 'top',
      point: topPoint,
    });
  }

  if (['|', 'L', 'J'].includes(getVal(plan, bottomPoint))) {
    positions.push({
      direction: 'down',
      point: bottomPoint,
    });
  }

  if (['-', '7', 'J'].includes(getVal(plan, rightPoint))) {
    positions.push({
      direction: 'right',
      point: rightPoint,
    });
  }

  if (['-', 'F', 'L'].includes(getVal(plan, leftPoint))) {
    positions.push({
      direction: 'left',
      point: leftPoint,
    });
  }

  return positions;
}

function getVal(plan: string[][], [y, x]: Point) {
  return plan[y][x];
}

function newPosition(direction: Direction, point: Point): Position {
  return {
    direction,
    point: pointByDirection(direction, point),
  };
}

function pointByDirection(direction: Direction, point: Point): Point {
  return { top, down, right, left }[direction](point);
}

function top([y, x]: Point): Point {
  return [y - 1, x];
}

function down([y, x]: Point): Point {
  return [y + 1, x];
}

function right([y, x]: Point): Point {
  return [y, x + 1];
}

function left([y, x]: Point): Point {
  return [y, x - 1];
}

function areEqual([ya, xa]: Point, [yb, xb]: Point) {
  return ya === yb && xa === xb;
}
