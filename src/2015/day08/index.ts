// https://adventofcode.com/2015/day/8

import { readFileSync } from 'fs'

const solution = solve()
console.log(solution)

function solve() {
  const input = readFileSync(`${__dirname}/input.txt`, 'utf-8')
  const lines = input.split('\n').map((line) => line.trim())
  const solution1 = lines.reduce((sum, line) => sum + countLine(line), 0);
  const solution2 = lines.reduce((sum, line) => sum + countLine2(line), 0);
  return { solution1, solution2 }
}

function countLine(line: string) {
  // return line.length - line.replace(/\\\\|\\"|\\x../g, 'X').slice(1, -1).length
	return line.length - eval(line).length;
}

function countLine2(line: string) {
  // return line.replace(/\\|"/g, 'XX').length + 2 - line.length;
	return JSON.stringify(line).length - line.length;
}
