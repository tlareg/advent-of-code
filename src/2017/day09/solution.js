"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const { score: firstStar, garbageCount: secondStar } = solve(inputStr)
console.log(firstStar, secondStar)

function solve(inputStr) {
  return inputStr.split('').reduce((acc, c) => {
    if (acc.ignoreNext) return { ...acc, ignoreNext: false }
    if (c === '!') return { ...acc, ignoreNext: true }
    if (c === '>') return { ...acc, isGarbage: false }
    if (acc.isGarbage) return { ...acc, garbageCount: acc.garbageCount + 1 }
    if (c === '<') return { ...acc, isGarbage: true }
    if (c === '{') {
      const lvl = acc.lvl + 1
      return { ...acc, lvl, score: acc.score + lvl } 
    } 
    if (c === '}') return {...acc, lvl: acc.lvl - 1 }
    return acc
  }, {
    lvl: 0,
    score: 0,
    ignoreNext: false,
    isGarbage: false,
    garbageCount: 0
  })
}