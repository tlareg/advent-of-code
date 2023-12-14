const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
const answers = parseInput(inputStr)
console.log(answers)

function parseInput(inputStr) {
  const horizontalNums = inputStr
    .replace(/\r\n/g,'\n').split('\n')
    .map(
      line => line
        .trim()
        .split(/\s+/)
        .map(s => parseInt(s, 10))
    )
  
  const verticalNums = []
  for (let i = 0; i < horizontalNums.length; i += 3) {
    const row1 = horizontalNums[i]
    const row2 = horizontalNums[i + 1]
    const row3 = horizontalNums[i + 2]
    for (let j = 0; j < 3; j++) {
      verticalNums.push([row1[j], row2[j], row3[j]])
    }
  }

  return {
    part1Answer: howManyValid(horizontalNums),
    part2Answer: howManyValid(verticalNums)
  }
}

function howManyValid(triangles) {
  return triangles.reduce((count, triangle) => {
    return isValidTriangle(triangle) ? ++count : count
  }, 0)
}

function isValidTriangle([a, b, c]) {
  return (
   (a + b) > c &&
   (b + c) > a &&
   (c + a) > b
  )
}

