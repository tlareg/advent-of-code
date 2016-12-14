const md5 = require('md5')
// const salt = 'abc'
const salt = 'zpqevtbw'

let i = 0
let md5Hash = ''
const hashKeys = []

for (let i = 0; hashKeys.length < 64; i++) {
  const has3Result = hasXInRow(getMd5Hash(`${salt}${i}`), 3)
  if (has3Result) {
    for (let j = i + 1, len = i + 1001; j < len; j++) {
      const has5Result = hasXInRow(getMd5Hash(`${salt}${j}`), 5)
      if (has5Result && has5Result === has3Result) {
        hashKeys.push([i, j])
        break;
      }
    }
  }
}

console.log(hashKeys.pop())

function strechKey(str) {
  for (let i = 0; i < 2017; i++) {
    str = md5(str)
  }
  return str
}

function getMd5Hash(str) {
  getMd5Hash.cache = getMd5Hash.cache || {}
  if (getMd5Hash.cache[str]) {
    return getMd5Hash.cache[str]
  }
  getMd5Hash.cache[str] = strechKey(str)
  return getMd5Hash.cache[str]
}

function hasXInRow(str, x) {
  let timesCounter = 0
  for (let i = 1, len = str.length; i < len; i++) {
    if (str[i] !== str[i - 1]) {
      timesCounter = 0
      continue;
    }
    ++timesCounter
    if (timesCounter >= x - 1) { return str[i] }
  }
  return false
}