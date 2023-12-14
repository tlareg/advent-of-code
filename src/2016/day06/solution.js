const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
parseInput(inputStr)

function parseInput(inputStr) {
  const arr = inputStr.replace(/\r\n/g,'\n').split('\n').map(line => line.split(''))
  
  const reduceResult = arr.reduce((acc, item) => {
    item.map((letter, idx) => {
      acc[idx] = acc[idx] || {}
      acc[idx][letter] = acc[idx][letter] ? ++acc[idx][letter] : 1
    })
    return acc
  }, [])

  const sortableResult = reduceResult.map((item) => {
    const sortable = []
    for (var letter in item) {
      sortable.push([letter, item[letter]])
    }
    return sortable
  })

  const sort = (arr, compareFn) => {
    return arr.map(item => {
      return item.sort(compareFn)[0][0]
    }).join('')
  }

  const part1Msg = sort(sortableResult, (a, b) => b[1] - a[1])
  const part2Msg = sort(sortableResult, (a, b) => a[1] - b[1])

  console.log(part1Msg)
  console.log(part2Msg)
}