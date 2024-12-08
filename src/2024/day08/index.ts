// https://adventofcode.com/2024/day/8

import { readFileSync } from 'fs';

type InputMap = string[];

type Freq = string;

type Position = {
  y: number;
  x: number;
};

type Antenna = Position & {
  freq: Freq;
};

type GroupedAntennas = Map<Freq, Antenna[]>;

type Bounds = {
  maxY: number;
  maxX: number;
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(map: InputMap) {
  const groupedAntennas = readAntennas(map);
  const bounds = {
    maxX: map[0].length - 1,
    maxY: map.length - 1,
  };

  return {
    part1: computeAntinodes(groupedAntennas, bounds).length,
    part2: computeAntinodes(groupedAntennas, bounds, true).length,
  };
}

function showMap(map: InputMap) {
  console.log('\n');
  for (const row of map) {
    console.log(row);
  }
  console.log('\n');
}

function showMapWithAntinodes(map: InputMap, antinodes: Position[]) {
  const newMap = [...map];
  antinodes.forEach(({ y, x }) => {
    newMap[y] = newMap[y].slice(0, x) + '#' + newMap[y].slice(x + 1);
  });
  showMap(newMap);
}

function readAntennas(map: InputMap): GroupedAntennas {
  const groupedAntennas: GroupedAntennas = new Map<string, Antenna[]>();

  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const value = row[x];
      if (value === '.') {
        continue;
      }
      groupedAntennas.set(value, [
        ...(groupedAntennas.get(value) ?? []),
        { freq: value, y, x },
      ]);
    }
  }

  return groupedAntennas;
}

function computeAntinodes(
  groupedAntennas: GroupedAntennas,
  bounds: Bounds,
  isPart2?: boolean
): Position[] {
  const antinodes: Position[] = [];

  for (const [_freq, antennas] of groupedAntennas) {
    const antinodesForFreq = computeAntinodesForFreq(antennas, bounds, isPart2);
    antinodes.push(...antinodesForFreq);
  }

  return filterUniquePoints(antinodes);
}

function computeAntinodesForFreq(
  antennas: Antenna[],
  bounds: Bounds,
  isPart2?: boolean
): Position[] {
  const antinodes = [];

  for (let i = 0; i < antennas.length; i++) {
    for (let j = i + 1; j < antennas.length; j++) {
      const antinodesForPair = computeAntinodesForPair(
        antennas[i],
        antennas[j],
        bounds,
        isPart2
      );

      antinodes.push(...antinodesForPair);
    }
  }

  return antinodes;
}

function computeAntinodesForPair(
  a: Position,
  b: Position,
  bounds: Bounds,
  isPart2?: boolean
): Position[] {
  // a ---> b
  const fromAToBVector = { x: b.x - a.x, y: b.y - a.y };

  // a --- b ---> x ---> x ---> (...)
  const antinodesFromB = getAntinodesByVector(fromAToBVector, b, bounds, isPart2);

  // a <--- b
  const fromBToAVector = { x: -fromAToBVector.x, y: -fromAToBVector.y };

  // (...) <--- x <--- x <--- a --- b
  const antinodesFromA = getAntinodesByVector(fromBToAVector, a, bounds, isPart2);

  return [...antinodesFromA, ...antinodesFromB];
}

function getAntinodesByVector(
  vector: Position,
  firstPoint: Position,
  bounds: Bounds,
  isPart2?: boolean
) {
  const antinodes = [];

  if (isPart2) {
    antinodes.push(firstPoint);
  }

  let isVisibleOnMap: boolean;

  do {
    const lastPoint = antinodes[antinodes.length - 1] ?? firstPoint;
    const nextAntinode = applyVector(lastPoint, vector);

    isVisibleOnMap = isInBounds(bounds, nextAntinode);
    if (isVisibleOnMap) {
      antinodes.push(nextAntinode);
    }
  } while (isPart2 && isVisibleOnMap);

  return antinodes;
}

function applyVector({ x, y }: Position, { x: vx, y: vy }: Position): Position {
  return {
    x: x + vx,
    y: y + vy,
  };
}

function isInBounds({ maxX, maxY }: Bounds, { y, x }: Position): boolean {
  return y >= 0 && y <= maxY && x >= 0 && x <= maxX;
}

function filterUniquePoints(points: Position[]): Position[] {
  const uniquePoints = new Set<string>();

  return points.filter((point) => {
    const key = `${point.x},${point.y}`;
    if (uniquePoints.has(key)) {
      return false;
    }
    uniquePoints.add(key);
    return true;
  });
}
