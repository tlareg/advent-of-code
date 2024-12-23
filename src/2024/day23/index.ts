// https://adventofcode.com/2024/day/23

import { readFileSync } from 'fs';

type Computers = Map<string, Set<string>>;

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const computers = parseInput(inputLines);

  const { setsOf3, part1Answer } = solvePart1(computers);
  const part2 = solvePart2(computers, setsOf3);

  return {
    part1: part1Answer,
    part2,
  };
}

function parseInput(inputLines: string[]): Computers {
  const connections = inputLines.map((line) => line.split('-'));

  return connections.reduce((acc, [c1, c2]) => {
    if (!acc.has(c1)) {
      acc.set(c1, new Set<string>());
    }
    if (!acc.has(c2)) {
      acc.set(c2, new Set<string>());
    }
    acc.get(c1)!.add(c2);
    acc.get(c2)!.add(c1);
    return acc;
  }, new Map<string, Set<string>>());
}

function solvePart1(computers: Computers) {
  const setsOf3 = new Set<string>();

  for (const [c1, set] of computers.entries()) {
    if (set.size < 2) {
      continue;
    }

    const connected = [...set];

    for (let i = 0; i < connected.length; i++) {
      const c2 = connected[i];
      for (let j = i + 1; j < connected.length; j++) {
        const c3 = connected[j];
        if (computers.get(c3)?.has(c2)) {
          const setOf3 = [c1, c2, c3].sort().join(',');
          setsOf3.add(setOf3);
        }
      }
    }
  }

  return {
    setsOf3,
    part1Answer: [...setsOf3].filter((s) =>
      s.split(',').some((c) => c[0] === 't')
    ).length,
  };
}

function solvePart2(computers: Computers, setsOf3: Set<string>) {
  const setsOfN: Array<Set<string>> = [setsOf3];
  const computersKeys = [...computers.keys()];

  let n = 0;

  while (setsOfN[n].size !== 0) {
    n++;
    setsOfN[n] = new Set<string>();

    for (let i = 0; i < computersKeys.length; i++) {
      const computer = computersKeys[i];
      const computerConnections = computers.get(computer);

      for (const set of setsOfN[n - 1]) {
        const computersInSet = set.split(',');
        if (computersInSet.includes(computer)) {
          continue;
        }
        if (computersInSet.every((c) => computerConnections?.has(c))) {
          setsOfN[n].add([computer, ...computersInSet].sort().join(','));
        }
      }
    }
  }

  return [...setsOfN[n-1].keys()][0];
}
