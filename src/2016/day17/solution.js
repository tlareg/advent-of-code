const md5 = require('md5')
const INPUT = 'edjrjqaa'

// const INPUT = 'ihgpwlah'
// const INPUT = 'kglvqrro'
// const INPUT = 'ulqzkmiv'

const startNode = { pos: [0, 0], path: '' }
const endNode = { pos: [3, 3] }

bfs(startNode, endNode)
bfsLongest(startNode, endNode)

function bfsLongest(startNode, targetNode) {
  const [ ty, tx ] = targetNode.pos
  const queue = [ startNode ]
  let maxDistance = 0
  let part2 = null

  while (queue.length) {
    const currNode = queue.shift()
    const adjacentNodes = getAdjacentNodes(currNode.pos, currNode.path)

    adjacentNodes.forEach(node => {
      const nodeKey = nodeToStr(node)
      const [y, x] = node.pos
      maxDistance = node.path.length
      if (y === ty && x === tx) {
        part2 = node.path.length
      } else {
        queue.push(node)
      }
    })
  }

  console.log(part2)
}


function bfs(startNode, targetNode, findLongest) {
  const [ ty, tx ] = targetNode.pos
  const queue = [ startNode ]
  const distance = { [nodeToStr(startNode)]: 0 }
  let part1 = null

  while (queue.length && !part1) {
    const currNode = queue.shift()
    const adjacentNodes = getAdjacentNodes(currNode.pos, currNode.path)

    adjacentNodes.forEach(node => {
      const nodeKey = nodeToStr(node)
      const [y, x] = node.pos
      if (!distance[nodeKey]) {
        distance[nodeKey] = node.path.length
        if (y === ty && x === tx) {
          part1 = node
        }
        queue.push(node)
      } 
    })
  }

  console.log(part1)
}

function nodeToStr(node) {
  return `${node.pos[0]}${node.pos[1]}${node.path}`
}

function getAdjacentNodes(pos, path) {
  const hash = getMd5Hash(`${INPUT}${path}`)
  const openDirs = getOpenDirs(pos, hash)
  return openDirs.map(dir => {
    return {
      pos: updatePos(pos, dir),
      path: path + dir
    }
  })
}

function updatePos(pos, dir) {
  const [y, x] = pos
  if (dir === 'U') { return [y - 1, x] }
  if (dir === 'D') { return [y + 1, x] }
  if (dir === 'L') { return [y, x - 1] }
  if (dir === 'R') { return [y, x + 1] }
}

function getMd5Hash(str) {
  getMd5Hash.cache = getMd5Hash.cache || {}
  if (getMd5Hash.cache[str]) {
    return getMd5Hash.cache[str]
  }
  getMd5Hash.cache[str] = md5(str)
  return getMd5Hash.cache[str]
}

function getOpenDirs(pos, hash) {
  const dirMap = ['U', 'D', 'L', 'R']
  let openDirs = hash.substr(0, 4).split('').reduce((acc, c, idx) => 
    isOpen(c) ? [...acc, dirMap[idx]] : acc, [])
  const [y, x] = pos
  if ( y === 0 ) { openDirs = openDirs.filter(c => c !== 'U') }
  if ( y === 3 ) { openDirs = openDirs.filter(c => c !== 'D') }
  if ( x === 0 ) { openDirs = openDirs.filter(c => c !== 'L') }
  if ( x === 3 ) { openDirs = openDirs.filter(c => c !== 'R') }
  return openDirs
}

function isOpen(character) {
  return 'bcdef'.includes(character)
}