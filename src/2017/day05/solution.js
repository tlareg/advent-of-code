"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
const jumps = inputStr.replace(/\r\n/g,'\n').split('\n').map(Number)

const first = solve(jumps, (jumps, pos) => jumps[pos] + 1)
console.log(first)

const second = solve(jumps, (jumps, pos) =>
  jumps[pos] >= 3 ? jumps[pos] - 1 : jumps[pos] + 1)
console.log(second)

function solve(jumps, getNewJump) {
  jumps = [...jumps]
  let pos = 0
  let steps = 0
  while (pos >= 0 && pos <= jumps.length - 1) {
    const jump = jumps[pos]
    jumps[pos] = getNewJump(jumps, pos)
    pos += jump
    steps++
  }
  return steps
}