"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const {
  currentMax: firstStar,
  allTimeMax: secondStar
} = solve(parseInput(inputStr))

console.log(firstStar, secondStar)

function parseInput(inputStr) {
  return inputStr.split('\r\n').map(line => {
    const match = line
      .match(/^(\w+)\s+(inc|dec)\s+(-?\d+)\s+if\s+(\w+)\s+([>=<!]+)\s+(-?\d+)$/)
    return {
      command: {
        register: match[1],
        operator: match[2],
        operand: parseInt(match[3], 10)
      },
      condition: {
        register: match[4],
        operator: match[5],
        operand: parseInt(match[6], 10)
      }
    }
  })
}

function solve(instructions) {
  return instructions.reduce(
    registersReducer,
    { registers: {}, allTimeMax: 0, currentMax: 0 }
  )
}

function registersReducer({ registers, allTimeMax }, { command, condition }) {
  registers[command.register] = registers[command.register] || 0
  registers[condition.register] = registers[condition.register] || 0

  if (checkCondition(registers, condition)) {
    registers = executeCommand(registers, command)
  }

  const currentMax = Math.max(...Object.values(registers))
  return {
    registers,
    currentMax,
    allTimeMax: currentMax > allTimeMax ? currentMax : allTimeMax
  }
}

function checkCondition(registers, { register, operator, operand }) {
  const val = registers[register]
  switch(operator) {
    case '>': return val > operand
    case '<': return val < operand
    case '<': return val < operand
    case '>=': return val >= operand
    case '==': return val == operand
    case '<=': return val <= operand
    case '!=': return val != operand
  }
}

function executeCommand(registers, { register, operator, operand }) {
  switch(operator) {
    case 'inc':
      return { ...registers, [register]: registers[register] + operand }
    case 'dec':
      return { ...registers, [register]: registers[register] - operand }
  }
}
