// http://keekerdc.com/2011/03/hexagon-grids-coordinate-systems-and-distance-calculations/
// https://www.redblobgames.com/grids/hexagons/

"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const {
  currentDistance: firstStar,
  maxDistance: secondStar
} = solve(inputStr)
console.log(firstStar, secondStar)

function solve(inputStr) {
  const dirs = inputStr.split(',')
  return dirs.reduce((state, dir) => {
    const point = move(state, dir)
    const currentDistance = Math.max(...Object.values(point))
    return {
      ...point,
      currentDistance,
      maxDistance: currentDistance > state.maxDistance
        ? currentDistance : state.maxDistance
    }
  }, { x: 0, y: 0, z: 0, maxDistance: 0, currentDistance: 0 })
}

function move({ x, y, z }, dir) {
  switch(dir) {
    case 'n' : return { x: --x, y,      z: ++z }
    case 'ne': return { x: --x, y: ++y, z      }
    case 'se': return { x,      y: ++y, z: --z }
    case 's' : return { x: ++x, y,      z: --z }
    case 'sw': return { x: ++x, y: --y, z      }
    case 'nw': return { x,      y: --y, z: ++z }
  }
}