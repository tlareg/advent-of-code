const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt', 'utf8').toString()
const MAX = 4294967295

parseInput(inputStr)

function parseInput(str) {
  const ranges = str.replace(/\r\n/g,'\n').split('\n').map(
    x => x.split('-').map(i => parseInt(i, 10))
  ).sort((a, b) => a[0] - b[0])

  let part1;
  let allowedCount = 0;
  let maxRangeEnd = ranges[0][1];

  if (ranges[0][0] !== 0) { 
    part1 = 0
    allowedCount += ranges[0][0] - 1
  }

  for (let i = 0; i < ranges.length - 1; i++) {
    const range = ranges[i]
    const nextRange = ranges[i + 1]
    if (maxRangeEnd < nextRange[0] - 1) {
      if (part1 === undefined) {
        part1 = maxRangeEnd + 1
      }
      allowedCount += (nextRange[0] - 1 - maxRangeEnd)
    }
    maxRangeEnd = Math.max(maxRangeEnd, nextRange[1])
  }

  if (maxRangeEnd < MAX) {
    if (part1 === undefined) {
      part1 = maxRangeEnd + 1
    }
    allowedCount += MAX - maxRangeEnd
  }

  console.log(`part1: ${part1}`)
  console.log(`part2: ${allowedCount}`)
}
