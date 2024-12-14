// https://adventofcode.com/2024/day/14

import { readFileSync } from 'fs';

type InputLineMatchGroups = {
  x: string;
  y: string;
  vx: string;
  vy: string;
};

type Robot = {
  y: number;
  x: number;
  v: {
    x: number;
    y: number;
  };
};

type Max = {
  y: number;
  x: number;
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const max = {
    x: 101,
    y: 103,
  };

  let robots = createRobots(inputLines);

  return {
    part1: solvePart1(robots, max),
    part2: solvePart2(robots, max),
  };
}

function createRobots(lines: string[]): Robot[] {
  return lines.reduce<Robot[]>((robots, line) => {
    const match = line.match(
      /p=(?<x>-?\d+),(?<y>-?\d+) v=(?<vx>-?\d+),(?<vy>-?\d+)/
    );
    const { x, y, vx, vy } = match?.groups as unknown as InputLineMatchGroups;

    robots.push({
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      v: { x: parseInt(vx, 10), y: parseInt(vy, 10) },
    });

    return robots;
  }, []);
}

function solvePart1(robots: Robot[], max: Max) {
  let temp = [...robots];

  for (let i = 0; i < 100; i++) {
    temp = temp.map((robot) => move(robot, max));
  }

  return getPart1Score(temp, max);
}

function move({ x, y, v }: Robot, max: Max): Robot {
  let newX = x + v.x;
  if (newX < 0) {
    newX = max.x - -newX;
  }
  if (newX >= max.x) {
    newX = newX - max.x;
  }

  let newY = y + v.y;
  if (newY < 0) {
    newY = max.y - -newY;
  }
  if (newY >= max.y) {
    newY = newY - max.y;
  }

  return {
    x: newX,
    y: newY,
    v,
  };
}

function getPart1Score(robots: Robot[], max: Max) {
  const middleX = Math.floor(max.x / 2);
  const middleY = Math.floor(max.y / 2);

  return robots
    .reduce<[number, number, number, number]>(
      (acc, { x, y }) => {
        if (x < middleX && y < middleY) {
          acc[0]++;
        }

        if (x > middleX && y < middleY) {
          acc[1]++;
        }

        if (x < middleX && y > middleY) {
          acc[2]++;
        }

        if (x > middleX && y > middleY) {
          acc[3]++;
        }

        return acc;
      },
      [0, 0, 0, 0]
    )
    .reduce((acc, n) => acc * n, 1);
}

function solvePart2(robots: Robot[], max: Max) {
  let temp = [...robots];

  for (let i = 0; i < 10000; i++) {
    temp = temp.map((robot) => move(robot, max));

    const count = countTouchingElements(temp);
    if (count > 10) {
      // see the console output and look if there is a christmas tree
      display(temp, max);
      console.log(`Posible part2 solution: ${i + 1}`);
    }
  }
}

function countTouchingElements(robots: Robot[]) {
  return robots.reduce((count, ra) => {
    const isTop = !!robots.find(rb => rb.x === ra.x && rb.y === ra.y - 1);
    const isBottom = !!robots.find(rb => rb.x === ra.x && rb.y === ra.y + 1);
    const isRight = !!robots.find(rb => rb.x === ra.x + 1 && rb.y === ra.y);
    const isLeft = !!robots.find(rb => rb.x === ra.x - 1 && rb.y === ra.y);

    if (isTop && isBottom && isRight && isLeft) {
      return count + 1;
    }

    return count;
  }, 0)
}

function display(robots: Robot[], max: Max) {
  for (let y = 0; y < max.y; y++) {
    const row: string[] = [];

    for (let x = 0; x < max.x; x++) {
      const val = robots.find((r) => r.x === x && r.y === y) ? 'x' : '.';
      row.push(val);
    }

    console.log(`${row.join('')}\n`);
  }
}