const fs = require('fs')
const [wireA, wireB] = fs
  .readFileSync('./input.txt')
  .toString()
  .split('\r\n')
  .map(x => x.split(','))

const getMap = wire => {
  let x = 0
  let y = 0
  let steps = 0

  return wire.reduce((acc, instruction) => {
    let [, dir, n] = instruction.match(/([UDRL])(\d+)/)
    n = parseInt(n, 10)

    if (dir === 'U') {
      for (let i = 0; i < n; i++) {
        ++y
        ++steps
        if (!acc[`${x}.${y}`]) acc[`${x}.${y}`] = steps
      }
    } else if (dir === 'D') {
      for (let i = 0; i < n; i++) {
        --y
        ++steps
        if (!acc[`${x}.${y}`]) acc[`${x}.${y}`] = steps
      }
    } else if (dir === 'R') {
      for (let i = 0; i < n; i++) {
        ++x
        ++steps
        if (!acc[`${x}.${y}`]) acc[`${x}.${y}`] = steps
      }
    } else if (dir === 'L') {
      for (let i = 0; i < n; i++) {
        --x
        ++steps
        if (!acc[`${x}.${y}`]) acc[`${x}.${y}`] = steps
      }
    }
    return acc
  }, {})
}

const mapA = getMap(wireA)
const mapB = getMap(wireB)

const mapAKeys = Object.keys(mapA)
const mapBKeys = Object.keys(mapB)

const crossPoints = mapAKeys.filter(point => mapBKeys.includes(point))

const closestDistance = crossPoints
  .map(p => p.split('.').map(Number))
  .reduce((minDistance, [x, y]) => {
    const distance = Math.abs(x) + Math.abs(y)
    if (minDistance === null) return distance
    return Math.min(distance, minDistance)
  }, null)

console.log({ firstStar: closestDistance })

const fewestCombinedSteps = crossPoints.reduce((minSteps, pointStr) => {
  const steps = mapA[pointStr] + mapB[pointStr]
  if (minSteps === null) return steps
  return Math.min(steps, minSteps)
}, null)

console.log({ secondStar: fewestCombinedSteps })
