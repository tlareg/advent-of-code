const fs = require('fs')
let input = fs.readFileSync('./input.txt').toString().split('')

console.log(`firstStar: ${react(input)}`)

const unitTypes = findPossibleUnitTypes(input)
const secondStar = unitTypes.reduce((minLength, unitType) => {
  const filteredInput = removeUnitType(input, unitType)
  const length = react(filteredInput)
  if (!minLength || length < minLength) return length
  return minLength
}, null)

console.log(`secondStar: ${secondStar}`)

function removeUnitType(input, unitType) {
  return input.filter(unit => unit.toUpperCase() !== unitType)
}

function findPossibleUnitTypes(input) {
  return input.reduce((unitTypes, unit) => {
    const unitType = unit.toUpperCase()
    if (!unitTypes.includes(unitType)) {
      unitTypes.push(unitType)
    }
    return unitTypes
  }, [])
}

function react(input) {
  let keepGoing = true
  while (keepGoing) {
    const { reacted, reducedInput } = reduce(input)
    keepGoing = reacted
    input = reducedInput
  }
  return input.length
}

function reduce(input) {
  const reducedInput = []
  let reacted = false

  for (let i = 0; ; ) {
    const current = input[i]
    const next = input[i + 1]

    if (!current) break
    if (!next) {
      reducedInput.push(current)
      break
    }

    if (areReacting(current, next)) {
      reacted = true
      i += 2
    } else {
      reducedInput.push(current)
      i++
    }

    if (i >= input.length) break
  }

  return { reacted, reducedInput }
}

function areReacting(a, b) {
  return (
    a.toUpperCase() === b.toUpperCase() &&
    ((a !== a.toUpperCase() && b === b.toUpperCase()) ||
      (a === a.toUpperCase() && b !== b.toUpperCase()))
  )
}
