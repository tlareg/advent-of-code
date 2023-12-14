const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const diagram = inputStr.replace(/\r\n/g,'\n').split('\n').map(
  line => line.split('').map(s => s.trim())
)

console.log(solve(diagram))

function solve(diagram) {
  let pos = { x: diagram[0].findIndex(x => x === '|'), y: 0 }
  let dir = 'D'
  const letters = []
  let steps = 0

  while (true) {
    const curr = diagram[pos.y][pos.x]

    if (!curr) break;
    if (curr === '+') {
      dir = findNewDir(diagram, pos, dir)
      if (!dir) break;
    } else if (!'|-'.includes(curr)) {
      letters.push(curr)
    }

    pos = move(pos, dir)
    steps++
  }

  return { firstStar: letters.join(''), secondStar: steps }
}

function move({ x, y }, dir) {
  switch (dir) {
    case 'U': return { y: y - 1, x }
    case 'D': return { y: y + 1, x }
    case 'R': return { y, x: x + 1 }
    case 'L': return { y, x: x - 1 }
  }
}

function findNewDir(diagram, { x, y }, dir) {
  const up    = (diagram[y - 1] || [])[x]     && 'U'
  const down  = (diagram[y + 1] || [])[x]     && 'D'
  const right = (diagram[y]     || [])[x + 1] && 'R'
  const left  = (diagram[y]     || [])[x - 1] && 'L'

  switch (dir) {
    case 'U':
    case 'D':
      return right || left
    case 'R':
    case 'L':
      return up || down
  }
}
