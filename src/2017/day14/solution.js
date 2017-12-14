const knotHash = require('./knot-hash')

const input = 'uugsqrei'

const makeKey = idx => `${input}-${idx}`
const padLeft = s => '0000'.substring(0, 4 - s.length) + s
const hex2Bin = n => padLeft(parseInt(n,16).toString(2))
const hashRow2BinArr = row => row.split('')
  .map(hex2Bin).join('').split('').map(Number)
const binRows = [...new Array(128).keys()]
  .map(makeKey)
  .map(knotHash)
  .map(hashRow2BinArr)

console.log(solveFirst(binRows))
console.log(solveSecond(binRows))

function solveFirst(binRows) {
  return binRows.reduce((sum, binRow) =>
    sum + binRow.reduce((s, n) => s + n, 0), 0)
}

function solveSecond(binRows) {
  const visited = {}
  let groupsCount = 0

  for (let y = 0; y < binRows.length; y++) {
    for (let x = 0; x < binRows[y].length; x++) {
      bfs(x, y)
    }
  }

  function bfs(x, y) {
    if (!isValidNode([x, y])) return;
    groupsCount++

    const nodesQueue = [[x, y]]
    while (nodesQueue.length) {
      const [x, y] = nodesQueue.shift()
      visited[`${x},${y}`] = true
      const adjacentNodes = [
        [x - 1, y], [x + 1, y], [x, y + 1], [x, y - 1]
      ].filter(isValidNode)
      nodesQueue.push.apply(nodesQueue, adjacentNodes)
    }
  }

  function isValidNode([x, y]) {
    return (
      x >= 0 &&
      (x <= binRows[0].length - 1) &&
      y >= 0 &&
      (y <= binRows.length - 1) &&
      !visited[`${x},${y}`] &&
      binRows[y][x]
    )
  }

  return groupsCount
}