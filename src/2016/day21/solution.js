Array.prototype.rotate = (function() {
  const unshift = Array.prototype.unshift
  const splice = Array.prototype.splice

  return function(count) {
    const len = this.length >>> 0
    count = count >> 0
    unshift.apply(this, splice.call(this, count % len, len))
    return this
  };
})();


const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt', 'utf8').toString()
const instructions = inputStr.replace(/\r\n/g,'\n').split('\n')

const strToScramble = 'abcdefgh'
const part1 = scramble(strToScramble, instructions)
console.log('Part1: ' + part1)

const strToUnscramble = 'fbgdceah'
const part2 = scramble(strToUnscramble, instructions.reverse(), true)
console.log('Part2: ' + part2)


function scramble(str, instructions, reversed) {
  let match;

  return instructions.reduce((str, instruction) => {
    match = instruction.match(/^swap\sposition\s(\d+)\swith\sposition\s(\d+)$/)
    if (match) { return swapPosition(str, parseInt(match[1], 10),  parseInt(match[2], 10)) }

    match = instruction.match(/^swap\sletter\s(.)\swith\sletter\s(.)$/)
    if (match) { return swapLetters(str, match[1], match[2]) }

    match = instruction.match(/^rotate\sright\s(\d+)\sstep[s]?$/)
    if (match) { 
      if (reversed) { return rotateLeft(str, parseInt(match[1], 10)) }
      return rotateRight(str, parseInt(match[1], 10)) 
    }

    match = instruction.match(/^rotate\sleft\s(\d+)\sstep[s]?$/)
    if (match) { 
      if (reversed) { return rotateRight(str, parseInt(match[1], 10)) }
      return rotateLeft(str, parseInt(match[1], 10)) 
    }

    match = instruction.match(/^rotate\sbased\son\sposition\sof\sletter\s(.)$/)
    if (match) { return rotateBasedOn(str, match[1], reversed) }

    match = instruction.match(/^reverse\spositions\s(\d+)\sthrough\s(\d+)$/)
    if (match) { return reversePositions(str, parseInt(match[1], 10),  parseInt(match[2], 10)) }

    match = instruction.match(/^move\sposition\s(\d+)\sto\sposition\s(\d+)$/)
    if (match) { 
      if (reversed) { return movePosition(str, parseInt(match[2], 10),  parseInt(match[1], 10)) }
      return movePosition(str, parseInt(match[1], 10),  parseInt(match[2], 10)) 
    }

    return str
  }, str)
}

function swapPosition(str, pos1, pos2) {
  const pos1Letter = str[pos1]
  const pos2Letter = str[pos2]
  const newStr = replaceAt(str, pos1, pos2Letter)
  return replaceAt(newStr, pos2, pos1Letter)
}

function replaceAt(str, index, letter) {
  return str.slice(0, index) + letter + str.slice(index + 1)
}

function swapLetters(str, letter1, letter2) {
  return swapPosition(str, str.indexOf(letter1), str.indexOf(letter2))
}

function rotateRight(str, steps) {
  return str.split('').rotate(-steps).join('')
}

function rotateLeft(str, steps) {
  return str.split('').rotate(steps).join('')
}

function rotateBasedOn(str, letter, reversed) {
  const index = str.indexOf(letter)
  if (!reversed) {
    return rotateRight(str, (index >= 4) ? index + 2 : index + 1)
  }
  const idxToReversedRotateStepsMap = { '0': 7, '1': 7, '2': 2, '3': 6, '4': 1, '5': 5, '6': 0, '7': 4 }
  return rotateRight(str, idxToReversedRotateStepsMap['' + index])
}

function reversePositions(str, pos1, pos2) {
  return str.slice(0, pos1) + 
    str.slice(pos1, pos2 + 1).split('').reverse().join('') +
    str.slice(pos2 + 1, str.length + 1)
}

function movePosition(str, pos1, pos2) {
  const pos1Letter = str[pos1]
  const newStr = str.slice(0, pos1) + str.slice(pos1 + 1, str.length + 1)
  return newStr.slice(0, pos2) + pos1Letter + newStr.slice(pos2, newStr.length + 1)
}