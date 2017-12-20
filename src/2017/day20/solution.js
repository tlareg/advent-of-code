const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const particles = parseInput(inputStr)
console.log(solveFirst(particles))
console.log(solveSecond(particles))

function parseInput(inputStr) {
  const parseNumbersArr = str => str.split(',').map(Number)
  return inputStr.split('\r\n').map((line, id) => {
    const match = line.match(/^p=<(.+)>,\s+v=<(.+)>,\s+a=<(.+)>$/)
    return {
      id,
      p: parseNumbersArr(match[1]),
      v: parseNumbersArr(match[2]),
      a: parseNumbersArr(match[3])
    }
  })
}

function solveFirst(particles) {
  particles = deepClone(particles)

  for (let i = 0; i < 1000; i++) {
    particles.forEach(p => {
      increaseBy(p, 'v', 'a')
      increaseBy(p, 'p', 'v')
    })
  }

  return particles
    .map(p => ({ id: p.id, distance: getDistance(p) }))
    .reduce(
      (acc, p) => p.distance < acc.distance ? p : acc,
      { id: undefined, distance: Infinity }
    )
}

function solveSecond(particles) {
  particles = deepClone(particles)

  for (let i = 0; i < 1000; i++) {
    particles.forEach(p => {
      increaseBy(p, 'v', 'a')
      increaseBy(p, 'p', 'v')
    })
    particles = filterOutColliding(particles)
  }

  return particles.length
}

function increaseBy(p, key1, key2) {
  [...new Array(3).keys()].forEach(i => p[key1][i] += p[key2][i])
}

function getDistance(p) {
  return Math.abs(p.p[0]) + Math.abs(p.p[1]) + Math.abs(p.p[2])
}

function filterOutColliding(particles) {
  particles.forEach(p1 => particles.forEach(p2 =>
    areColliding(p1, p2) && (p1.colliding = p2.colliding = true)
  ))
  return particles.filter(p => !p.colliding)
}

function areColliding(p1, p2) {
  if (p1.id === p2.id) return false;
  return (
    p1.p[0] === p2.p[0] &&
    p1.p[1] === p2.p[1] &&
    p1.p[2] === p2.p[2]
  )
}

function deepClone(a) {
  return JSON.parse(JSON.stringify(a))
}