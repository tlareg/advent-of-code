"use strict";

const fs = require('fs')
const inputStr = 'R8, R4, R4, R8' //fs.readFileSync('./input.txt').toString()

const answers = parseInput(inputStr)
console.log(answers)

function parseInput(inputStr) {
  const inputArr = inputStr.split(',').map(s => s.trim())

  let cardinalDirection = 'N'
  let firstCoordinatesVisitedTwice = null
  const startCoordinates = { x: 0, y: 0 }
  const history = [startCoordinates]

  const endCoordinates = inputArr.reduce(({x, y}, itemStr) => {
    const relativeDirection = itemStr[0]
    const distance = parseInt(itemStr.slice(1), 10)

    cardinalDirection = updateCardinalDirection(cardinalDirection, relativeDirection)
    const newCoordinates = updateCoordinates({x, y}, cardinalDirection, distance)

    if (!firstCoordinatesVisitedTwice && isInHistory(history, newCoordinates)) {
      firstCoordinatesVisitedTwice = newCoordinates
    }

    console.log(newCoordinates)

    history.push(newCoordinates)
    return newCoordinates
  }, startCoordinates)

  const totalDistance = taxicabDistance(endCoordinates, startCoordinates)
  const bunnyHqDistance = firstCoordinatesVisitedTwice ? taxicabDistance(firstCoordinatesVisitedTwice, startCoordinates) : null

  return {
    part1Answer: totalDistance,
    part2Answer: bunnyHqDistance
  }
}

function updateCardinalDirection(cardinalDirection, relativeDirection) {
  switch(cardinalDirection) {
    case 'N': return (relativeDirection === 'R') ? 'E' : 'W';
    case 'S': return (relativeDirection === 'R') ? 'W' : 'E';
    case 'E': return (relativeDirection === 'R') ? 'S' : 'N';
    case 'W': return (relativeDirection === 'R') ? 'N' : 'S';
  }
}

function updateCoordinates({x, y}, cardinalDirection, distance) {
  switch(cardinalDirection) {
    case 'N': y += distance; break;
    case 'S': y -= distance; break;
    case 'E': x += distance; break;
    case 'W': x -= distance; break;
  }
  return {x, y}
}

function taxicabDistance({ x: xa, y: ya }, { x: xb, y: yb }) {
  return Math.abs(xa - xb) + Math.abs(ya - yb)
}

function isInHistory(history, coordinates) {
  return history.some(c => areCoordinatesEqual(c, coordinates))
}

function areCoordinatesEqual({ x: xa, y: ya }, { x: xb, y: yb }) {
  return (xa === xb) && (ya === yb)
}