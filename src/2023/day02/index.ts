// https://adventofcode.com/2023/day/2

import { readFileSync } from 'fs';

const COLORS = ['red', 'green', 'blue'] as const;

type Color = (typeof COLORS)[number];

type Set = Record<Color, number>;

type Games = {
  [gameNr in string]: Set[];
};

const BAG = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const games = getGames(inputLines);
  return {
    part1: solvePart1(games),
    part2: solvePart2(games),
  };
}

function getGames(inputLines: string[]): Games {
  return inputLines.reduce<Games>((acc, line) => {
    const [gameStr, setsStr] = line.split(':');
    const [, gameNr] = gameStr.split(' ');
    const sets = setsStr.split(';').map((set) =>
      set
        .split(',')
        .map((setPart) => setPart.trim().split(' '))
        .reduce<Set>(
          (acc, [countStr, color]) => {
            acc[color as Color] = parseInt(countStr, 10);
            return acc;
          },
          { red: 0, green: 0, blue: 0 }
        )
    );

    acc[gameNr] = sets;

    return acc;
  }, {});
}

function solvePart1(games: Games) {
  return Object.entries(games).reduce<number>(
    (possibleGameNumbersSum, [gameNumber, game]) =>
      isGamePossible(game)
        ? possibleGameNumbersSum + parseInt(gameNumber, 10)
        : possibleGameNumbersSum,
    0
  );
}

function solvePart2(games: Games) {
  return Object.values(games)
    .map((game) => getMinimumBag(game).reduce((acc, num) => acc * num, 1))
    .reduce((sum, num) => sum + num, 0);
}

function isGamePossible(sets: Set[]) {
  return sets.every(isSetPossible);
}

function isSetPossible(set: Set) {
  return COLORS.reduce<boolean>(
    (result, color) => result && set[color] <= BAG[color],
    true
  );
}

function getMinimumBag(sets: Set[]): number[] {
  return COLORS.map((color) => Math.max(...sets.map((s) => s[color])));
}
