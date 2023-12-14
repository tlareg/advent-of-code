const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt', 'utf8').toString()
const lines = inputStr.replace(/\r\n/g,'\n').split('\n')
const discs = lines.map(mapInputLineToDisk)

console.log(`Part 1: ${findTime(discs)}`)

discs.push({
  id: discs.length + 1,
  positionsCount: 11,
  currentPosition: 0
})

console.log(`Part 2: ${findTime(discs)}`)

function mapInputLineToDisk(line) {
  const match = line.match(
    /^.+\s#(\d+)\shas\s(\d+)\spositions.+time=(\d+).+position\s(\d+)\.$/
  )
  const [, id, positionsCount, time, currentPosition] = 
    match.slice(0, 5).map(x => parseInt(x, 10))
  return { id, positionsCount, currentPosition }
}

function findTime(discs) {
  let everyDiscAtPositionZero = false
  for(let time = 0 ;; time++) {
    everyDiscAtPositionZero = discs.every(
      disc => getDiscPositionAfterTicks(
        disc, 
        getTicksForwardAfterTime(disc, time)
      ) === 0
    )
    if (everyDiscAtPositionZero) { return time }
  }
}

function getDiscPositionAfterTicks(disc, ticks) {
  return ((disc.currentPosition + ticks) % disc.positionsCount)
}

function getTicksForwardAfterTime(disc, time) {
  return time + disc.id
}

