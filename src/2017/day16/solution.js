"use strict"

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
const commands = inputStr.split(',')

const initPrograms = [...new Array(16).keys()]
  .map(i => String.fromCharCode(97 + i)).join('')

console.log(solveFirst(initPrograms, commands))
console.log(solveSecond(initPrograms, commands))

function solveFirst(programs, commands) {
  return dance(programs, commands)
}

function solveSecond(programs, commands) {
  const numberOfDances = 1000000000
  const cache = []
  const cycleFound = () => cache.indexOf(programs) >= 0

  for (let i = 0; i < numberOfDances; ++i) {
    if (cycleFound()) { 
      return cache[numberOfDances % i]
    }
    cache.push(programs)       
    programs = dance(programs, commands)
  }
}

function dance(programs, commands) {
  return commands.reduce(executeCommand, programs)
}

function executeCommand(programs, command) {
  let match
  switch (command[0]) {
    case 's':
      match = command.match(/^s(\d+)$/)
      return spin(programs, Number(match[1]))
    case 'x':
      match = command.match(/^x(\d+)\/(\d+)$/)
      return exchange(programs, Number(match[1]), Number(match[2]))
    case 'p':
      match = command.match(/^p(\w+)\/(\w+)$/)
      return partner(programs, match[1], match[2])
    default:
      return programs
  }
}

function spin(programs, n) {
  return programs.slice(-n) + programs.slice(0,-n)
}

function exchange(programs, a, b) {
  const arr = [...programs.split('')]
  const temp = arr[a]
  arr[a] = arr[b]
  arr[b] = temp
  return arr.join('')
}

function partner(programs, a, b) {
  const findIdx = x => programs.split('').findIndex(p => p === x)
  return exchange(programs, findIdx(a), findIdx(b))
}