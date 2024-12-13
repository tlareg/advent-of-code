// https://adventofcode.com/2024/day/11

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  let stones = inputLines[0].split(' ');

  return {
    part1: blink(stones, 25),
    part2: blink(stones, 75),
  };
}

function blink(stones: string[], n: number): number {
  const cache = new Map();

  /**
   * solveStone('1000', 2) -->
   * solveStone('10', 1) + solveStone('0', 1) -->
   * solveStone('1', 0) + solveStone('0', 0) + solveStone('2024', 0) -->
   * 1 + 1 + 1
   */
  function solveStone(stone: string, n: number): number {
    if (n === 0) {
      return 1;
    }

    const cacheKey = `${stone},${n}`;
    const save = (result: number) => {
      cache.set(cacheKey, result);
      return result;
    };

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    if (stone == '0') {
      return save(solveStone('1', n - 1));
    }

    if (stone.length % 2 === 0) {
      const middleIndex = stone.length / 2;
      const a = stone.slice(0, middleIndex);
      const b = stone.slice(middleIndex);
      return save(
        solveStone(`${parseInt(a, 10)}`, n - 1) +
          solveStone(`${parseInt(b, 10)}`, n - 1)
      );
    }

    return save(solveStone(`${parseInt(stone, 10) * 2024}`, n - 1));
  }

  return stones.reduce((sum, stone) => sum + solveStone(stone, n), 0);
}
