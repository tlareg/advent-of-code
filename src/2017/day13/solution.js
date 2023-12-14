"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const scanners = inputStr.replace(/\r\n/g,'\n').split('\n').map(line => {
  const [depth, range] = line.split(/:\s+/).map(Number)
  return { depth, range }
})

console.log(solveFirst(0, scanners))
console.log(solveSecond(scanners))

function solveFirst(delay, scanners) {
  return scanners
    .filter(s => isCaught(delay, s))
    .reduce((sum, { depth, range }) => sum + depth * range, 0);
}

function solveSecond(scanners) {
  let delay = -1;
  let someCought = true
  while (someCought) {
    ++delay
    someCought = scanners.some(s => isCaught(delay, s))
  }
  return delay
}

function isCaught(delay, { depth, range }) {
  return (delay + depth) % (2 * (range - 1)) === 0
}