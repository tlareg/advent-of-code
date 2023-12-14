class Carrier {
  constructor({ x, y }) {
    this.dir = 'U'
    this.x = x
    this.y = y

    this.dirFlowByState = {
      0:   {'U': 'L', 'L': 'D', 'D': 'R', 'R': 'U'}, // left
      'W': null,
      1:   {'U': 'R', 'R': 'D', 'D': 'L', 'L': 'U'}, // right
      'F': {'U': 'D', 'D': 'U', 'L': 'R', 'R': 'L'}  // reverse
    }

    this.infectionFlow = {
      first:  { 0: 1, 1: 0 },
      second: { 0: 'W', 'W': 1, 1: 'F', 'F': 0 },
    }

    this.movesByDir = { 'U': [0,-1], 'D': [0,1], 'R': [1,0], 'L': [-1,0] }
  }

  turn(gridMap) {
    const currentNodeState = gridMap[`${this.x},${this.y}`] || 0
    const flow = this.dirFlowByState[currentNodeState]
    if (!flow) return;
    this.dir = flow[this.dir]
  }

  modify({ gridMap, infectionFlow }) {
    const { x, y } = this
    gridMap[`${x},${y}`] = this.infectionFlow[infectionFlow][gridMap[`${x},${y}`] || 0]
    return gridMap[`${x},${y}`] === 1
  }

  move() {
    const [x, y] = this.movesByDir[this.dir]
    this.x += x
    this.y += y
  }
}

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const firstStar = solve({
  ...parseInput(inputStr),
  burstsCount: 10000,
  infectionFlow: 'first'
})
console.log(firstStar)

const secondStar = solve({
  ...parseInput(inputStr),
  burstsCount: 10000000,
  infectionFlow: 'second'
})
console.log(secondStar)

function parseInput(inputStr) {
  const gridMap = {}
  const matrix = inputStr.replace(/\r\n/g,'\n').split('\n').map(r => r.split(''))
  matrix.forEach((r, y) => r.forEach((c, x) =>
    gridMap[`${x},${y}`] = (c === '#' ) ? 1 : 0
  ))
  return { gridMap, height: matrix.length, width: matrix[0].length }
}

function solve({ gridMap, height, width, burstsCount, infectionFlow }) {
  let infectionsCount = 0

  const carrier = new Carrier({
    x: Math.floor(width / 2),
    y: Math.floor(height / 2)
  })

  for (let i = 0; i < burstsCount; i++) {
    carrier.turn(gridMap)
    const infected = carrier.modify({ gridMap, infectionFlow })
    if (infected) infectionsCount++
    carrier.move()
  }

  return infectionsCount
}