"use strict";

const input = 361527
console.log(solve(input))

function solve(input) {
  const initialState = { 
    x: 0, 
    y: 0,
    size: 1,
    dir: 'R',
    dirChangeCount: 0,
    sums: { '0,0': 1 },
    secondStar: undefined
  }

  const { x, y, secondStar } = [...Array(input + 1).keys()].splice(2, input)
    .reduce(reducer, initialState)
  
  return {
    firstStar: Math.abs(x) + Math.abs(y),
    secondStar
  }
}

function reducer({ x, y, dir, size, dirChangeCount, sums, secondStar }, n) {
  const { x: newX, y: newY } = move({ x, y, dir })

  if (!secondStar) {
    const sum = computeSum(sums, newX, newY)
    sums[`${newX},${newY}`] = sum
    if (sum > input) {
      secondStar = sum
    }
  }

  if (dirChangeCount === 4) {
    dirChangeCount = 0
    size++
  }

  let newDir = dir
  if (shouldChangeDir(dir, newX, newY, size)) {
    newDir = getNextDir(dir)
    dirChangeCount++
  }
  
  return { x: newX, y: newY, dir: newDir, size, dirChangeCount, sums, secondStar}
}

function move({ x, y, dir}) {
  switch(dir) {
    case 'R': return { x: ++x, y }
    case 'L': return { x: --x, y }
    case 'U': return { x, y: --y }
    case 'D': return { x, y: ++y }
  }
}

function shouldChangeDir(dir, x, y, size) {
  return (
    (['R', 'L'].includes(dir) && Math.abs(x) >= size) ||
    (['U', 'D'].includes(dir) && Math.abs(y) >= size)
  )
}

function getNextDir(dir) {
  return { 'R': 'U', 'U': 'L', 'L': 'D', 'D': 'R' }[dir]
}

function computeSum(sums, x, y) {
  const s = (x, y) => sums[`${x},${y}`] || 0
  return (
    s(x, y + 1) +
    s(x, y - 1) +
    s(x + 1, y - 1) +
    s(x + 1, y) +
    s(x + 1, y + 1) +
    s(x - 1, y - 1) +
    s(x - 1, y) +
    s(x - 1, y + 1)
  )
}