const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const lines = inputStr.split('\r\n')

const boxes = lines.map(line => {
  const match = line.match(/^#(\d+)\s+@\s+(\d+),(\d+):\s+(\d+)x(\d+)$/)
  return {
    id: parseInt(match[1], 10),
    x: parseInt(match[2], 10),
    y: parseInt(match[3], 10),
    w: parseInt(match[4], 10),
    h: parseInt(match[5], 10),
  }
})

const fabric = {}
const overlapedBoxIds = new Set()

boxes.forEach(box => {
  for (let x = box.x; x < box.x + box.w; x++) {
    for (let y = box.y; y < box.y + box.h; y++) {
      if (!fabric[`${x},${y}`]) {
        fabric[`${x},${y}`] = [box.id]
      } else {
        fabric[`${x},${y}`].push(box.id)
        fabric[`${x},${y}`].forEach(boxId => overlapedBoxIds.add(boxId))
      }
    }
  }
})

const firstStar = Object.keys(fabric).reduce(
  (sum, key) => (fabric[key].length > 1 ? sum + 1 : sum),
  0
)

const secondStar = boxes.find(box => !overlapedBoxIds.has(box.id)).id

console.log(`firstStar: ${firstStar}`)
console.log(`secondStar: ${secondStar}`)
