// https://adventofcode.com/2025/day/1
import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string): string[] {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => line.trim());
}

function solve(inputLines: string[]) {
  return {
    part1: solvePart1(inputLines),
    part2: solvePart2(inputLines),
  };
}

function solvePart1(inputLines: string[]): number {
  let position = 50;
  let landsOnZero = 0;

  for (const rotation of inputLines) {
    position = applyRotation(position, rotation);
    if (position === 0) {
      landsOnZero++;
    }
  }

  return landsOnZero;
}

function solvePart2(inputLines: string[]): number {
  let position = 50;
  let passesZero = 0;

  for (const rotation of inputLines) {
    const result = applyRotationWithCount(position, rotation);
    position = result.newPosition;
    passesZero += result.zeroCount;
  }

  return passesZero;
}

interface Rotation {
  direction: 'R' | 'L';
  distance: number;
}

function parseRotation(rotation: string): Rotation {
  const match = rotation.match(/^(?<dir>R|L)(?<value>\d+)$/);
  if (!match?.groups) {
    throw new Error(`Invalid rotation format: ${rotation}`);
  }

  const { dir, value } = match.groups;
  return {
    direction: dir as 'R' | 'L',
    distance: parseInt(value, 10),
  };
}

function applyRotation(position: number, rotation: string): number {
  const { direction, distance } = parseRotation(rotation);
  const newPosition =
    direction === 'R' ? position + distance : position - distance;

  return normalize(newPosition);
}

function normalize(value: number): number {
  return ((value % 100) + 100) % 100;
}

function applyRotationWithCount(
  position: number,
  rotation: string
): { newPosition: number; zeroCount: number } {
  const { direction, distance } = parseRotation(rotation);

  return direction === 'R'
    ? rotateRight(position, distance)
    : rotateLeft(position, distance);
}

function rotateRight(
  position: number,
  distance: number
): { newPosition: number; zeroCount: number } {
  const newPosition = normalize(position + distance);

  let zeroCount = 0;
  if (distance >= 100 - position) {
    const distanceToFirstZero = 100 - position;
    zeroCount = 1 + Math.floor((distance - distanceToFirstZero) / 100);
  }

  return { newPosition, zeroCount };
}

function rotateLeft(
  position: number,
  distance: number
): { newPosition: number; zeroCount: number } {
  const newPosition = normalize(position - distance);

  let zeroCount = 0;

  if (position > 0 && distance >= position) {
    zeroCount = 1 + Math.floor((distance - position) / 100);
  } else if (position === 0 && distance >= 100) {
    zeroCount = Math.floor(distance / 100);
  }

  return { newPosition, zeroCount };
}
