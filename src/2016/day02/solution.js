const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
const answers = parseInput(inputStr)
console.log(answers)

function parseInput(inputStr) {

  // 1 2 3
  // 4 5 6
  // 7 8 9
  const numDirMap = {
    '1': { 'U': '1', 'D': '4', 'R': '2', 'L': '1' },
    '2': { 'U': '2', 'D': '5', 'R': '3', 'L': '1' },
    '3': { 'U': '3', 'D': '6', 'R': '3', 'L': '2' },
    '4': { 'U': '1', 'D': '7', 'R': '5', 'L': '4' },
    '5': { 'U': '2', 'D': '8', 'R': '6', 'L': '4' },
    '6': { 'U': '3', 'D': '9', 'R': '6', 'L': '5' },
    '7': { 'U': '4', 'D': '7', 'R': '8', 'L': '7' },
    '8': { 'U': '5', 'D': '8', 'R': '9', 'L': '7' },
    '9': { 'U': '6', 'D': '9', 'R': '9', 'L': '8' },
  }

  //     1
  //   2 3 4
  // 5 6 7 8 9
  //   A B C
  //     D
  const numDirMap2 = {
    '1': { 'U': '1', 'D': '3', 'R': '1', 'L': '1' },
    '2': { 'U': '2', 'D': '6', 'R': '3', 'L': '2' },
    '3': { 'U': '1', 'D': '7', 'R': '4', 'L': '2' },
    '4': { 'U': '4', 'D': '8', 'R': '4', 'L': '3' },
    '5': { 'U': '5', 'D': '5', 'R': '6', 'L': '5' },
    '6': { 'U': '2', 'D': 'A', 'R': '7', 'L': '5' },
    '7': { 'U': '3', 'D': 'B', 'R': '8', 'L': '6' },
    '8': { 'U': '4', 'D': 'C', 'R': '9', 'L': '7' },
    '9': { 'U': '9', 'D': '9', 'R': '9', 'L': '8' },
    'A': { 'U': '6', 'D': 'A', 'R': 'B', 'L': 'A' },
    'B': { 'U': '7', 'D': 'D', 'R': 'C', 'L': 'A' },
    'C': { 'U': '8', 'D': 'C', 'R': 'C', 'L': 'B' },
    'D': { 'U': 'B', 'D': 'D', 'R': 'D', 'L': 'D' },
  }

  const inputLines = inputStr.replace(/\r\n/g,'\n').split('\n')
  return {
    part1Answer: getKey(inputLines, numDirMap),
    part2Answer: getKey(inputLines, numDirMap2)
  }
}

function getKey(inputLines, numDirMap) {
  let currentNum = '5'
  const numsArr = inputLines.map(line => {
    const dirsArr = line.split('')
    currentNum = dirsArr.reduce(
      (currentNum, dir) => numDirMap[currentNum][dir],
      currentNum
    )
    return currentNum
  })
  return numsArr.join('')
}
