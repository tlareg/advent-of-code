"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const answer = parseInput(inputStr)
console.log(answer)

function parseInput(inputStr) {
  const inputArr = inputStr.split(',').map(s => s.trim())

  let cardinalDirection = 'N'
  const startCoordinates = { x: 0, y: 0 }

  const endCoordinates = inputArr.reduce(({x, y}, item) => {
    const relativeDirection = item[0]
    const distance = parseInt(item[1], 10)
    cardinalDirection = updateCardinalDirection(cardinalDirection, relativeDirection)
    return updateCoordinates({x, y}, cardinalDirection, distance)
  }, startCoordinates)

  const totalDistance = taxicabDistance(endCoordinates, startCoordinates)
  return totalDistance
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