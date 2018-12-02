const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const lines = inputStr.split('\r\n')

const firstStar = () => {
  const { seen2Times, seen3Times } = lines.reduce(({ seen2Times, seen3Times }, line) => {
    const seen = [...line].reduce((acc, c) => {
      acc[c] = (acc[c] || 0) + 1
      return acc
    }, {})

    if (Object.values(seen).includes(2)) seen2Times++
    if (Object.values(seen).includes(3)) seen3Times++

    return { seen2Times, seen3Times }
  }, {
    seen2Times: 0,
    seen3Times: 0
  })

  return seen2Times * seen3Times;
}

console.log(`first star: ${firstStar(lines)}`)

