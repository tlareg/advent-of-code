// https://adventofcode.com/2020/day/3

import { readFileSync } from 'fs';

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(map: string[]) {
  const part1 = getTreeCount(map, { y: 1, x: 3 });

  const part2 = [
    getTreeCount(map, { y: 1, x: 1}),
    part1,
    getTreeCount(map, { y: 1, x: 5}),
    getTreeCount(map, { y: 1, x: 7}),
    getTreeCount(map, { y: 2, x: 1}),
  ].reduce((acc, n) => acc * n, 1);

  return {
    part1,
    part2
  };
}

function getTreeCount(map: string[], slope: { y: number; x: number }): number {
  let currentPos = { y: 0, x: 0 };
  let treeCount = 0;
  const maxX = map[0].length - 1;

  while (currentPos.y < map.length - 1) {
    currentPos.y += slope.y;
    currentPos.x += slope.x;

    if (currentPos.x > maxX) {
      currentPos.x = currentPos.x - (maxX + 1);
    }

    const mapValue = map[currentPos.y][currentPos.x];

    if (mapValue === '#') {
      treeCount++;
    }
  }

  return treeCount;
}
