"use strict";

const isValid = words => words.reduce(
  (acc, w) => acc === false ? acc : (acc[w] ? false : {...acc, [w]: 1}),
  {}
)

const sortWordLetters = w => w.split('').sort().join('')
const areAnagrams = (w1, w2) => sortWordLetters(w1) === sortWordLetters(w2)
const isValid2 = words => {
  for (let i = 0, len = words.length; i < len; i++) {
    const w1 = words[i]
    for (let j = 0; j < len; j++) {
      if (i === j) continue;
      const w2 = words[j]
      if (areAnagrams(w1, w2)) return false;
    }
  }
  return true;
}

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
const passphrases = inputStr.split('\r\n').map(line => line.split(/\s+/))

const firstAnswer = passphrases.filter(isValid).length
console.log(firstAnswer)

const secondAnswer = passphrases.filter(isValid2).length
console.log(secondAnswer)
