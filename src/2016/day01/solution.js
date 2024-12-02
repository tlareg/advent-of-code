"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

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

    let newCoordinates = {x, y};
    for (let i = 0; i < distance; i++) {
      newCoordinates = updateCoordinates(newCoordinates, cardinalDirection, 1)
      if (!firstCoordinatesVisitedTwice && isInHistory(history, newCoordinates)) {
        firstCoordinatesVisitedTwice = newCoordinates
      }
      history.push(newCoordinates)
    }

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
  const isRight = relativeDirection === 'R'
  switch(cardinalDirection) {
    case 'N': return isRight ? 'E' : 'W';
    case 'S': return isRight ? 'W' : 'E';
    case 'E': return isRight ? 'S' : 'N';
    case 'W': return isRight ? 'N' : 'S';
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
