// https://adventofcode.com/2024/day/25

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const { keys, locks } = parseInput(inputLines);

  return {
    part1: countLockKeyPairs(locks, keys),
  };
}

function parseInput(inputLines: string[]) {
  const locks: number[][] = [];
  const keys: number[][] = [];

  let currentMap: string[] = [];

  const addItem = (map: string[]) => {
    const isLock = map[0].split('').every((x) => x === '#');

    const lock: number[] = [];
    const key: number[] = [];

    for (let x = 0; x < map[0].length; x++) {
      for (let y = 0; y < map.length; y++) {
        if (map[y][x] === (isLock ? '.' : '#')) {
          if (isLock) {
            lock.push(y - 1);
          } else {
            key.push(map.length - y - 1);
          }
          break;
        }
      }
    }

    if (isLock) {
      locks.push(lock);
    } else {
      keys.push(key);
    }
  };

  for (const line of inputLines) {
    if (line === '') {
      addItem(currentMap);
      currentMap = [];
      continue;
    }

    currentMap.push(line);
  }

  if (currentMap.length) {
    addItem(currentMap);
  }

  return { locks, keys };
}

function countLockKeyPairs(locks: number[][], keys: number[][]): number {
  let count = 0;

  for (let k = 0; k < keys.length; k++) {
    const key = keys[k];
    for (let l = 0; l < locks.length; l++) {
      const lock = locks[l];
      if (isMatching(lock, key)) {
        count++;
      }
    }
  }

  return count;
}

function isMatching(lock: number[], key: number[]): boolean {
  for (let i = 0; i < lock.length; i++) {
    if (lock[i] + key[i] > 5) {
      return false;
    }
  }
  return true;
}
