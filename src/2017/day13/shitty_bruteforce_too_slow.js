"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const scanners = inputStr.replace(/\r\n/g,'\n').split('\n').map(line => {
  const [depth, range] = line.split(/:\s+/).map(Number)
  return { depth, range, pos: 0, dir: 'D' }
})

console.log(solveFirst(scanners))
console.log(solveSecond(scanners))

function solveFirst(scanners) {
  const coughtAtDepths = go(scanners, 0)
  const severity = coughtAtDepths.reduce((sum, depth) => {
    const scaner = scanners.find(s => s.depth === depth)
    return sum + scaner.depth * scaner.range
  }, 0)
  return severity
}

function solveSecond(scanners) {
  let coughtAtDepths = []
  let delay = 0
  while(true) {
    coughtAtDepths = go(scanners, delay)
    if (coughtAtDepths.length === 0) break;
    ++delay
  }
  return delay
}

function go(scanners, delay) {
  const maxDepth = scanners[scanners.length - 1].depth
  const depths = [...new Array(maxDepth + 1).keys()]
  const initialScanners = (delay < 1)
    ? scanners
    : [...new Array(delay).keys()]
        .reduce((scanners) => moveScanners(scanners), scanners)

  const { coughtAtDepths } = depths.reduce(
    ({ scanners, coughtAtDepths }, currentDepth) => {
      const currentScaner = scanners.find(s => s.depth === currentDepth)
      return {
        coughtAtDepths: (currentScaner && currentScaner.pos === 0)
          ? [...coughtAtDepths, currentDepth]
          : coughtAtDepths,
        scanners: moveScanners(scanners)
      }
    }, { scanners: initialScanners, coughtAtDepths: [] }
  )

  return coughtAtDepths
}

function moveScanners(scanners) {
  return scanners.map(s => {
    const dir = (s.pos === 0) ? 'D' : ((s.pos === s.range - 1) ? 'U' : s.dir)
    const pos = dir === 'D' ? s.pos + 1 : s.pos - 1
    return { ...s, dir, pos }
  })
}