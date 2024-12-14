// https://adventofcode.com/2024/day/13

import { readFileSync } from 'fs';

type Machine = {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  px: number;
  py: number;
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const machines = parseInput(inputLines);

  return {
    part1: solvePart1(machines),
    part2: solvePart2(machines),
  };
}

function parseInput(lines: string[]): Machine[] {
  let machines: Machine[] = [];
  let machine: Partial<Machine> = {};
  let match;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    match = line.match(/Button A: X\+(?<ax>\d+), Y\+(?<ay>\d+)/);
    if (match) {
      const { ax, ay } = match.groups as unknown as { ax: string; ay: string };
      machine = {
        ...machine,
        ax: Number(ax),
        ay: Number(ay),
      };
      continue;
    }

    match = line.match(/Button B: X\+(?<bx>\d+), Y\+(?<by>\d+)/);
    if (match) {
      const { bx, by } = match.groups as unknown as { bx: string; by: string };
      machine = {
        ...machine,
        bx: Number(bx),
        by: Number(by),
      };
      continue;
    }

    match = line.match(/Prize: X=(?<px>\d+), Y=(?<py>\d+)/);
    if (match) {
      const { px, py } = match.groups as unknown as { px: string; py: string };
      machine = {
        ...machine,
        px: Number(px),
        py: Number(py),
      };

      machines.push(machine as Machine);
      machine = {};
    }
  }

  return machines;
}

function solvePart1(machines: Machine[]) {
  return machines.reduce(
    (sum, machine) => sum + getMinMachineCostForPart1(machine),
    0
  );
}

function getMinMachineCostForPart1(machine: Machine): number {
  const MAX_PRESS_COUNT = 100;
  const { ax, ay, bx, by, px, py } = machine;

  // ax * a + bx * b == px;
  // ay * a + by * b == py;
  // 0 <= a <= 100
  // 0 <= b <= 100
  // cost = 3 * a + b;
  // result = min(cost)

  let minCost;

  for (let a = 0; a <= MAX_PRESS_COUNT; a++) {
    for (let b = 0; b <= MAX_PRESS_COUNT; b++) {
      const isEquationTrue = ax * a + bx * b === px && ay * a + by * b === py;
      if (!isEquationTrue) {
        continue;
      }

      const cost = 3 * a + b;
      if (minCost === undefined || cost < minCost) {
        minCost = cost;
      }
    }
  }

  return minCost ?? 0;
}

function solvePart2(machines: Machine[]) {
  return machines.reduce(
    (sum, machine) => sum + getMinMachineCostForPart2(machine),
    0
  );
}

function getMinMachineCostForPart2(machine: Machine): number {
  const OFFSET = Math.pow(10, 13);

  const { ax, ay, bx, by, px: oldPx, py: oldPy } = machine;

  const px = oldPx + OFFSET;
  const py = oldPy + OFFSET;

  const d = ax * by - ay * bx;
  const [a, b] = [(by * px - py * bx) / d, (ax * py - ay * px) / d];

  return Number.isInteger(a) && Number.isInteger(b) ? a * 3 + b : 0;
}
