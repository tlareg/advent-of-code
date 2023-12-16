// https://adventofcode.com/2023/day/16

import { readFileSync } from 'fs';

type Matrix = string[][];

type Point = { x: number; y: number };

type Direction = 'up' | 'down' | 'right' | 'left';

type Beam = {
  point: Point;
  direction: Direction;
};

const solution = solve(readInput(`${__dirname}/input.txt`));
console.log(solution);

function readInput(inputFilePath: string): Matrix {
  return readFileSync(inputFilePath, 'utf-8')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.split(''));
}

function solve(matrix: Matrix) {
  return {
    part1: solvePart1(matrix, { point: { x: 0, y: 0 }, direction: 'right' }),
    part2: solvePart2(matrix),
  };
}

function solvePart1(matrix: Matrix, startingBeam: Beam) {
  const beams: Beam[] = [startingBeam];

  // x,y
  const visited = new Set<string>(); // x,y

  // x,y,direction - remember visited splitters and mirrors to break beam loops
  const visitedDirectionChangers = new Set<string>();

  while (beams.length) {
    const beam = beams[0];
    const { x, y } = beam.point;
    const currentSymbol = readSymbol(matrix, beam.point);
    handleSymbol(currentSymbol, beam, beams, visitedDirectionChangers);
    if (currentSymbol) {
      visited.add(`${x},${y}`);
    }
  }

  return visited.size;
}

function readSymbol(matrix: Matrix, { x, y }: Point): string | null {
  return isValidPoint(matrix, { x, y }) ? matrix[y][x] : null;
}

function isValidPoint(matrix: Matrix, { x, y }: Point) {
  return (
    y >= 0 && y <= matrix.length - 1 && x >= 0 && x <= matrix[0].length - 1
  );
}

function handleSymbol(
  symbol: string | null,
  beam: Beam,
  beams: Beam[],
  visitedDirectionChangers: Set<string>
) {
  const removeCurrentBeam = () => beams.shift();

  if (!symbol) {
    removeCurrentBeam();
    return;
  }

  if (symbol === '.') {
    moveBeam(beam, beam.direction);
    return;
  }

  const dirChangeId = `${beam.point.x},${beam.point.y},${beam.direction}`;
  if (visitedDirectionChangers.has(dirChangeId)) {
    removeCurrentBeam();
    return;
  }
  visitedDirectionChangers.add(dirChangeId);

  if (symbol === '/') {
    moveBeam(
      beam,
      ({ up: 'right', down: 'left', left: 'down', right: 'up' } as const)[
        beam.direction
      ]
    );
    return;
  }

  if (symbol === '\\') {
    moveBeam(
      beam,
      ({ up: 'left', down: 'right', left: 'up', right: 'down' } as const)[
        beam.direction
      ]
    );
    return;
  }

  if (symbol === '-') {
    if (['right', 'left'].includes(beam.direction)) {
      moveBeam(beam, beam.direction);
      return;
    }
    beams.push({
      direction: 'left',
      point: { x: beam.point.x - 1, y: beam.point.y },
    });
    beams.push({
      direction: 'right',
      point: { x: beam.point.x + 1, y: beam.point.y },
    });
    removeCurrentBeam();
    return;
  }

  if (symbol === '|') {
    if (['up', 'down'].includes(beam.direction)) {
      moveBeam(beam, beam.direction);
      return;
    }
    beams.push({
      direction: 'up',
      point: { x: beam.point.x, y: beam.point.y - 1 },
    });
    beams.push({
      direction: 'down',
      point: { x: beam.point.x, y: beam.point.y + 1 },
    });
    removeCurrentBeam();
    return;
  }
}

function moveBeam(beam: Beam, direction: Direction) {
  beam.direction = direction;
  beam.point = getNextPoint(beam);
}

function getNextPoint(beam: Beam): Point {
  const {
    point: { x, y },
    direction,
  } = beam;

  return {
    up: { x, y: y - 1 },
    down: { x, y: y + 1 },
    left: { x: x - 1, y },
    right: { x: x + 1, y },
  }[direction];
}

function display(matrix: Matrix) {
  console.log('\n---------------------------\n');
  matrix.forEach((row) => {
    console.log(row.join(''));
  });
}

function displayVisited(matrix: Matrix, visited: Set<string>) {
  console.log('\nvisited ---------------------------\n');
  matrix.forEach((row, y) => {
    const rowToDisplay: string[] = [];
    row.forEach((_symbol, x) => {
      rowToDisplay.push(visited.has(`${x},${y}`) ? '#' : '.');
    });
    console.log(rowToDisplay.join(''));
  });
}

function solvePart2(matrix: Matrix) {
  const results: number[] = [];

  matrix.forEach((row, y) => {
    results.push(
      solvePart1(matrix, { point: { x: 0, y }, direction: 'right' })
    );
    results.push(
      solvePart1(matrix, { point: { x: row.length - 1, y }, direction: 'left' })
    );
  });

  matrix[0].forEach((_symbol, x) => {
    results.push(solvePart1(matrix, { point: { x, y: 0 }, direction: 'down' }));
    results.push(
      solvePart1(matrix, {
        point: { x, y: matrix.length - 1 },
        direction: 'up',
      })
    );
  });

  return Math.max(...results);
}
