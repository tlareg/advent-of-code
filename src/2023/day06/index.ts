// https://adventofcode.com/2023/day/6

import { readFileSync } from 'fs';

type Race = {
  time: number;
  distance: number;
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

function solvePart1(inputLines: string[]) {
  const [timeLine, distanceLine] = inputLines;
  const times = parseLineForPart1(timeLine);
  const distances = parseLineForPart1(distanceLine);
  const races = times.map((time, i) => ({ time, distance: distances[i] }));
  return solveForRaces(races);
}

function parseLineForPart1(line: string) {
  return line
    .split(':')[1]
    .trim()
    .split(/\s+/)
    .map((x) => parseInt(x, 10));
}

function solvePart2(inputLines: string[]) {
  const [timeLine, distanceLine] = inputLines;
  const time = parseLineForPart2(timeLine);
  const distance = parseLineForPart2(distanceLine);
  return solveForRaces([{ time, distance }]);
}

function parseLineForPart2(line: string) {
  const num = line.split(':')[1].trim().split(/\s+/).join('');
  return parseInt(num, 10);
}

function solveForRaces(races: Race[]) {
  return races.map(getNumberOfWaysBeatingRecord).reduce((acc, x) => acc * x, 1);
}

function getNumberOfWaysBeatingRecord({
  time: raceTime,
  distance: recordDistance,
}: Race) {
  return [...Array(raceTime).keys()]
    .map((holdTime) => getDistance(holdTime, raceTime))
    .filter((distanceByHold) => distanceByHold > recordDistance).length;
}

function getDistance(holdTime: number, raceTime: number) {
  return holdTime * (raceTime - holdTime);
}
