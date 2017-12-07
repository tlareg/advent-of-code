"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
const programs = parseInput(inputStr)

const rootProgram = solveFirst(programs)
console.log('first star: ', rootProgram.name)

const secondAnswer = solveSecond(programs, rootProgram)
console.log('second star: ', secondAnswer)

function parseInput(inputStr) {
  const lines = inputStr.split('\r\n')
  const programs = {}

  lines.forEach(line => {
    const match = line.match(/^(\w+)\s+\((\d+)\)(\s+\->\s+(.+))?$/)
    const name = match[1]
    const weight = parseInt(match[2], 10)
    const childrenNames = match[4] ? match[4].split(',').map(n => n.trim()) : []
    programs[name] = { name, weight, childrenNames, parentName: undefined }
  })

  Object.values(programs).forEach(p => {
    p.childrenNames.forEach(name => {
      programs[name].parentName = p.name
    })
  })

  return programs
}

function solveFirst(programs) {
  return Object.values(programs).find(p => !p.parentName)
}

function solveSecond(programs, rootProgram) {
  let answer = false

  function getWeight(program) {
    if (answer) return;
    const childrenWeights = program.childrenNames.map(n => ({ n, w: getWeight(programs[n]) }))

    const targetWeight = mostCommonValue([...childrenWeights.map(({n, w}) => w)])
    const { n: errorName, w: errorWeight } =
      childrenWeights.find(({ n, w }) => w !== targetWeight) || {}
    if (errorWeight) {
      answer = targetWeight - errorWeight + programs[errorName].weight
      return;
    }

    return program.weight + childrenWeights.reduce((s, {n, w}) => s + w, 0)
  }

  getWeight(rootProgram)
  return answer
}

function mostCommonValue(arr) {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length - arr.filter(v => v === b).length
  ).pop();
}