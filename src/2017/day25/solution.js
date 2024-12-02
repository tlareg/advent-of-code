const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const blueprint = parseInput(inputStr)
console.log(solve(blueprint))

function parseInput(inputStr) {
  const inputLines = inputStr.replace(/\r\n/g,'\n').split('\n').filter(l => !!l)
  let pos = 0
  const beginState = inputLines[pos++].match(/^.*state\s+(\w).$/)[1]
  const steps = Number(inputLines[pos++].match(/^.*after\s+(\d+)\s+steps.$/)[1])
  const states = {}

  while (pos < inputLines.length) {
    const state = inputLines[pos++].match(/^In\s+state\s+(\w):$/)[1]
    states[state] = {}

    for (let i = 0; i < 2; i++) {
      let currentVal = Number(inputLines[pos++].match(/^.*current\s+value\s+is\s+(0|1):$/)[1])
      states[state][currentVal] = {
        writeVal: Number(inputLines[pos++].match(/^.*Write.*(0|1).$/)[1]),
        moveDir: inputLines[pos++].match(/^.*Move.*(left|right).$/)[1],
        continueState: inputLines[pos++].match(/^.*state\s+(\w).$/)[1]
      }
    }
  }

  return { beginState, steps, states }
}

function solve(blueprint) {
  const { beginState, steps, states } = blueprint
  const tape = {}
  let cursor = 0
  let currentState = beginState

  for (let i = 0; i < steps; ++i) {
    const currentValue = tape[cursor] || 0
    const { writeVal, moveDir, continueState } = states[currentState][currentValue]
    tape[cursor] = writeVal
    cursor = cursor + ((moveDir === 'right') ? 1 : -1)
    currentState = continueState
  }

  const checksum = Object.values(tape).reduce((sum, x) => sum + x, 0)
  return checksum
}