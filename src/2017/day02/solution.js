"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const firstAnswer = inputStr.split('\r\n')
  .map(line => {
    const numsRow = line.split(/\s+/).map(Number)
    const { min, max } = numsRow.reduce(
      (acc, n) => {
        return {
          min: n < acc.min ? n : acc.min,
          max: n > acc.max ? n : acc.max
        }
      }, 
      { min: numsRow[0], max: numsRow[0] }
    )
    return max - min
  })
  .reduce((sum, diff) => sum + diff)

console.log(firstAnswer)

const secondAnswer = inputStr.split('\r\n')
  .map(line => {
    const numsRow = line.split(/\s+/).map(Number)
    for (let i = 0; i < numsRow.length; i++) {
      let n = numsRow[i]
      for (let j = 0; j < numsRow.length; j++) {
        let n2 = numsRow[j]
        if (i === j) { continue; }
        if (n % n2 === 0) {
          return n / n2
        }
      }
    }
  })
  .reduce((sum, n) => sum + n)

console.log(secondAnswer)