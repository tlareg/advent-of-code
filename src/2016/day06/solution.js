const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
parseInput(inputStr)

function parseInput(inputStr) {
  const arr = inputStr.split('\r\n').map(line => line.split(''))
  
  const reduceResult = arr.reduce((acc, item) => {
    item.map((letter, idx) => {
      acc[idx] = acc[idx] || {}
      acc[idx][letter] = acc[idx][letter] ? ++acc[idx][letter] : 1
    })
    return acc
  }, [])

  const msg = reduceResult.map((item) => {
    const sortable = []
    for (var letter in item) {
      sortable.push([letter, item[letter]])
    }
    const sorted = sortable.sort((a, b) => b[1] - a[1])
    return sorted[0][0]
  }).join('')

  // part1 answer
  console.log(msg)
}