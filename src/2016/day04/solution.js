const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
const answers = parseInput(inputStr)
console.log(answers)

function parseInput(inputStr) {
  const lines = inputStr.split('\r\n')
  let idSum = 0
  
  lines.forEach(line => {
    const splittedLine = line.split('-')
    const match = splittedLine.pop().match(/(\d+)\[([a-zA-Z]+)\]/)

    const name = splittedLine.join('')
    const id = parseInt(match[1], 10)
    const checksum = match[2]

    if (isValidChecksum(name, checksum)) {
      idSum += id
      const decryptedName = decryptName(name, id)
      // part2 answer
      if (decryptedName.includes('pole')) {
        console.log(decryptedName)
        console.log(id)
      }
    }
  })

  return {
    part1Answer: idSum
  }
}

function decryptName(name, id) {
  const shiftChar = ch => String.fromCharCode(97 + (ch.charCodeAt() - 97 + id) % 26)
  return name.replace(/./g, shiftChar)
}

function isValidChecksum(name, checksum) {
  // { b: 4, c: 4, a: 5,}
  let letterCounts = name.split('').reduce((acc, letter) => {
    acc[letter] = acc[letter] ? ++acc[letter] : 1
    return acc
  }, {})

  // [[a, 5], [b, 4], [c, 4]]
  const transform1 = [];
  for (var letter in letterCounts) {
    transform1.push([letter, letterCounts[letter]])
  }

  // { '5': 'a', '4': 'bc'}
  const transform2 = transform1.reduce((acc, item) => {
    const [ letter, count ] = item
    acc[count] = acc[count] 
      ? acc[count] += letter 
      : letter
    return acc
  }, {})

  // [ [5, 'a'], [4, 'bc']]
  const transform3 = []
  for (var count in transform2) {
    transform3.push([parseInt(count, 10), transform2[count].split('').sort().join('')])
  }
  transform3.sort((a, b) => b[0] - a[0])

  let computedChecksum = ''
  for (let i = 0, len = transform3.length; i < len; i++) {
    computedChecksum += transform3[i][1]
    if (computedChecksum.length >= 5) {
      computedChecksum = computedChecksum.slice(0, 5)
      break;
    }
  }

  return checksum === computedChecksum
}