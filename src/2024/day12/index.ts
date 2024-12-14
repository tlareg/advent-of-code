// https://adventofcode.com/2024/day/12

import { readFileSync } from 'fs';

type Point = {
  y: number;
  x: number;
  val: string;
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(map: string[]) {
  const areas = findAreas(map);

  return {
    part1: solvePart1(areas),
    part2: solvePart2(areas),
  };
}

function findAreas(map: string[]): Array<Map<string, Point>> {
  const visited = new Set();
  const areas: Array<Map<string, Point>> = [];

  const findAreaPoints = (point: Point, area: Map<string, Point>): void => {
    area.set(pointKey(point), point);
    visited.add(pointKey(point));

    iterateSiblings(point, ({ y, x }) => {
      if (y > map.length - 1 || x > map[0].length - 1) {
        return;
      }

      const newPoint = { y, x, val: map[y]?.[x] };
      if (visited.has(pointKey(newPoint))) {
        return;
      }

      if (newPoint.val === point.val) {
        area.set(pointKey(newPoint), newPoint);
        visited.add(pointKey(newPoint));
        findAreaPoints(newPoint, area);
      }
    });
  };

  iterateMap(map, (point) => {
    if (visited.has(pointKey(point))) {
      return;
    }
    const area = new Map<string, Point>();
    findAreaPoints(point, area);
    areas.push(area);
  });

  return areas;
}

function pointKey({ y, x }: Pick<Point, 'y' | 'x'>) {
  return `${y},${x}`;
}

function iterateMap(map: string[], callback: (point: Point) => void) {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      callback({ y, x, val: row[x] });
    }
  }
}

function getSiblings({ y, x }: Pick<Point, 'y' | 'x'>) {
  const top = { y: y - 1, x };
  const down = { y: y + 1, x };
  const left = { y, x: x - 1 };
  const right = { y, x: x + 1 };

  return [top, right, down, left];
}

function iterateSiblings(
  point: Point,
  callback: (point: Pick<Point, 'y' | 'x'>) => void
) {
  for (const p of getSiblings(point)) {
    callback(p);
  }
}

function solvePart1(areas: Array<Map<string, Point>>): number {
  return areas
    .map((area) => area.size * getAreaPerimeter(area))
    .reduce((sum, price) => sum + price, 0);
}

function getAreaPerimeter(area: Map<string, Point>) {
  return Array.from(area.values()).reduce(
    (sum, point) => sum + getPointPerimeter(area, point),
    0
  );
}

function getPointPerimeter(area: Map<string, Point>, point: Point): number {
  let perimeter = 0;
  iterateSiblings(point, (p) => {
    if (!area.has(pointKey(p))) {
      perimeter++;
    }
  });
  return perimeter;
}

function solvePart2(areas: Array<Map<string, Point>>): number {
  return areas
    .map((area) => area.size * getSidesCount(area))
    .reduce((sum, price) => sum + price, 0);
}

/**
 * sides count is equal to corners count
 */
function getSidesCount(area: Map<string, Point>): number {
  return Array.from(area.values()).reduce(
    (sum, point) => sum + getCornersCountForPoint(point, area),
    0
  );
}

function getCornersCountForPoint(
  point: Point,
  area: Map<string, Point>
): number {
  const [top, right, down, left] = getSiblings(point);
  let count = 0;

  /**
   * xxx
   * AAx
   * AAx
   */
  if (!area.has(pointKey(top)) && !area.has(pointKey(right))) {
    count++;
  }

  if (!area.has(pointKey(right)) && !area.has(pointKey(down))) {
    count++;
  }

  if (!area.has(pointKey(down)) && !area.has(pointKey(left))) {
    count++;
  }

  if (!area.has(pointKey(left)) && !area.has(pointKey(top))) {
    count++;
  }

  /**
   * xxx
   * Axx
   * AAx
   */
  if (area.has(pointKey(top)) && area.has(pointKey(right))) {
    const topRight = { y: top.y, x: right.x };
    if (!area.has(pointKey(topRight))) {
      count++;
    }
  }

  if (area.has(pointKey(right)) && area.has(pointKey(down))) {
    const rightDown = { y: down.y, x: right.x };
    if (!area.has(pointKey(rightDown))) {
      count++;
    }
  }

  if (area.has(pointKey(down)) && area.has(pointKey(left))) {
    const downLeft = { y: down.y, x: left.x };
    if (!area.has(pointKey(downLeft))) {
      count++;
    }
  }

  if (area.has(pointKey(left)) && area.has(pointKey(top))) {
    const leftTop = { y: top.y, x: left.x };
    if (!area.has(pointKey(leftTop))) {
      count++;
    }
  }

  return count;
}
