const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
parseInput(inputStr)

function parseInput(inputStr) {
  const lines = inputStr.split('\r\n')
  const howManyIPv7 = lines.reduce(
    (count, lineStr) => isIPv7(lineStr) ? ++count : count, 0
  )

  // part1 answer
  console.log(howManyIPv7)
}

function isIPv7(str) {
  const { abbaParts, nonAbbaParts } = splitIPv7(str)
  return (
    abbaParts.some(part => hasABBA(part)) &&
    !nonAbbaParts.some(part => hasABBA(part))
  )
}

function splitIPv7(str) {
  const abbaParts = []
  const nonAbbaParts = []
  const splitRes = str.split('[')
  splitRes.forEach(s => {
    const split2Res = s.split(']')
    if (split2Res.length === 1) {
      split2Res[0] && abbaParts.push(split2Res[0])
    } else {
      split2Res[1] && abbaParts.push(split2Res[1])
      split2Res[0] && nonAbbaParts.push(split2Res[0])
    }
  })
  return { abbaParts, nonAbbaParts }
}

function hasABBA(str) {
  if (str.length < 4) { return false }
  for (let i = 0; i < str.length; i++) {
    if (!str[i]) break;
    if (isABBA(str.slice(i, i + 4))) { return true }
  }
  return false
}

function isABBA(str) {
  if (str.length !== 4) { return false }
  if (str[0] === str[1]) { return false }
  return str === str.split('').reverse().join('')
}