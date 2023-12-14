const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const components = parseInput(inputStr)
console.log(solveFirst(components))
console.log(solveSecond(components))

function parseInput(inputStr) {
  return inputStr.replace(/\r\n/g,'\n').split('\n')
    .map(line => line.split('/').map(Number))
    .map(([a, b], id) => ({ id, a, b }))
}

function solveFirst(components) {
  const bridges = build([], components, 0)
  return bridgesMaxStrength(bridges)
}

function solveSecond(components) {
  const bridges = build([], components, 0)
  const maxLen = bridges.reduce((maxLen, bridge) => {
    return maxLen > bridge.length ? maxLen : bridge.length
  }, 0)
  const longestBridges = bridges.filter(b => b.length === maxLen)
  return bridgesMaxStrength(longestBridges)
}

function bridgesMaxStrength(bridges) {
  return bridges.reduce((max, bridge) => {
    const strength = bridge.reduce((sum, {a, b}) => sum + a + b, 0)
    return strength > max ? strength : max
  }, 0)
}

function build(bridge, components, n) {
  const comps = components.filter(({a, b}) => a === n || b === n)
  if (!comps || !comps.length) return [bridge];

  let resultBridges = []
  for (let i = 0; i < comps.length; i++) {
    const comp = comps[i]
    const nextN = comp.a === n ? comp.b : comp.a
    const remainingComponents = components.filter(c => c.id !== comp.id)
    const variants = build([...bridge, {...comp}], remainingComponents, nextN)
    resultBridges = [...resultBridges, ...variants]
  }
  return resultBridges
}