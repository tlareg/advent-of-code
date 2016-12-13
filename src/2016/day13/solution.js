const input = 1350

bfs([1, 1], [31, 39], 50)

function bfs(startNode, targetNode, maxDistance) {
  const [ tx, ty ] = targetNode
  const queue = [ startNode ]
  const distance = { [`${startNode[0]}${startNode[1]}`]: 0 }
  let part1 = 0
  let part2 = 0

  while (!part1 || !part2 && queue.length) {
    const [x, y] = queue.shift()
    const adjacentNodes = [ 
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1] 
    ].filter(isValidNode)

    if (!part2 && distance[`${x}${y}`] === maxDistance) {
      part2 = Object.keys(distance).length;
    }

    adjacentNodes.forEach(([nx, ny]) => {
      if (!distance[`${nx}${ny}`]) {
        distance[`${nx}${ny}`] = distance[`${x}${y}`] + 1
        if (`${nx}${ny}` === `${tx}${ty}`) {
          part1 = distance[`${nx}${ny}`]
        }
        queue.push([nx, ny])
      } 
    })
  }

  console.log(`part1: ${part1}`)
  console.log(`part2: ${part2}`)
}

function isValidNode([x, y]) {
  return (x >= 0 && y >= 0) && !isWall(x, y)
}

function isWall(x, y) {
  const sum = x*x + 3*x + 2*x*y + y + y*y + input
  const binSum = dec2bin(sum)
  const oneBitsCount = binSum.split('')
    .reduce((acc, item) => item === '1' ? ++acc : acc, 0)
  return oneBitsCount % 2 === 1
}

function dec2bin(dec) {
  return (dec >>> 0).toString(2)
}