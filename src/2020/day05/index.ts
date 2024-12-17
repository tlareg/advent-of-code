// https://adventofcode.com/2020/day/5

import { readFileSync } from 'fs';

type Seat = {
  row: number;
  col: number;
  seatId: number;
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  const seats = parseInput(inputLines);
  const minSeat = seats[0];
  const maxSeat = seats[seats.length - 1];
  const missingSeat = findMissingSeat(seats, minSeat, maxSeat);

  return {
    part1: maxSeat.seatId,
    part2: missingSeat.seatId,
  };
}

function parseInput(inputLines: string[]): Seat[] {
  return inputLines
    .map((line) => {
      const res = line
        .split('')
        .map((c) => (['B', 'R'].includes(c) ? '1' : '0'))
        .join('');

      const [row, col] = splitAtIndex(res, 7).map((s) => parseInt(s, 2));

      return { row, col, seatId: row * 8 + col };
    })
    .sort((a, b) => a.seatId - b.seatId);
}

function findMissingSeat(seats: Seat[], minSeat: Seat, maxSeat: Seat): Seat {
  const seatsSet = new Set(seats.map((s) => `${s.row},${s.col}`));

  for (let r = minSeat.row; r <= maxSeat.row; r++) {
    for (let c = 0; c < 8; c++) {
      if (r === minSeat.row && c < minSeat.col) {
        continue;
      }
      if (r === maxSeat.row && c > maxSeat.col) {
        break;
      }
      if (!seatsSet.has(`${r},${c}`)) {
        return { row: r, col: c, seatId: r * 8 + c };
      }
    }
  }

  throw 'no missing seat';
}

function splitAtIndex(value: string, index: number) {
  return [value.substring(0, index), value.substring(index)];
}
