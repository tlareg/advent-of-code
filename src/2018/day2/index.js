const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const lines = inputStr.replace(/\r\n/g,'\n').split('\n')

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

const diff = (word1, word2) => {
  const common = [...word1].reduce((acc, char, i) =>
    (char === word2[i]) ? acc + char : acc, '')
  return common.length === word1.length - 1 ? common : false;
}

const secondStar = lines => {
  let common;
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      common = diff(lines[i], lines[j])
      if (common) return common;
    }
  }
}

console.log(`second star: ${secondStar(lines)}`)
