const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
parseInput(inputStr)

function parseInput(inputStr) {
  const lines = inputStr.replace(/\r\n/g,'\n').split('\n')

  const howManySupportsTLS = lines.reduce(
    (count, lineStr) => supportsTLS(lineStr) ? ++count : count, 0
  )

  const howManySupportsSSL = lines.reduce(
    (count, lineStr) => supportsSSL(lineStr) ? ++count : count, 0
  )

  // part1 answer
  console.log(howManySupportsTLS)

  // part2 answer
  console.log(howManySupportsSSL)
}

function supportsTLS(str) {
  const { supernetSeqArr, hypernetSeqArr } = splitIPv7(str)
  return (
    supernetSeqArr.some(part => hasABBA(part)) &&
    !hypernetSeqArr.some(part => hasABBA(part))
  )
}

function splitIPv7(str) {
  const supernetSeqArr = []
  const hypernetSeqArr = []
  const splitRes = str.split('[')
  splitRes.forEach(s => {
    const split2Res = s.split(']')
    if (split2Res.length === 1) {
      split2Res[0] && supernetSeqArr.push(split2Res[0])
    } else {
      split2Res[1] && supernetSeqArr.push(split2Res[1])
      split2Res[0] && hypernetSeqArr.push(split2Res[0])
    }
  })
  return { supernetSeqArr, hypernetSeqArr }
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

function supportsSSL(str) {
  const { supernetSeqArr, hypernetSeqArr } = splitIPv7(str)
  const supernetABAs = findSeqArrABAs(supernetSeqArr)
  const hypernetABAs = findSeqArrABAs(hypernetSeqArr)
  return supernetABAs.some(
    saba => hypernetABAs.some(haba => areCorrespondingABAs(saba, haba))
  )
}

function findSeqArrABAs(seqArr) {
  return seqArr.reduce((acc, str) => {
    return [...acc, ...findABAs(str)]
  }, [])
}

function findABAs(str) {
  const result = []
  if (str.length < 3) { return result }
  for (let i = 0; i < str.length; i++) {
    if (!str[i]) break;
    const slice = str.slice(i, i + 3)
    if (isABA(slice)) { 
      result.push(slice)
    }
  }
  return result
}

function isABA(str) {
  if (str.length !== 3) { return false }
  if (str[0] === str[1]) { return false }
  return str === str.split('').reverse().join('')
}

function areCorrespondingABAs(aba1, aba2) {
  return ( 
    aba1[0] === aba2[1] &&
    aba1[1] === aba2[0]
  ) 
}
