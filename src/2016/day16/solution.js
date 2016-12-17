// const length = 272
const length = 35651584
const input = '00111101111101000'

let curveResult = input
while (curveResult.length < length) {
  curveResult = dragonCurve(curveResult)
}
curveResult = curveResult.substr(0, length)

let curveChecksum = checkSum(curveResult)
while(curveChecksum.length % 2 === 0) {
  curveChecksum = checkSum(curveChecksum)
}

console.log(curveChecksum)

function dragonCurve(a) {
  const b = a.split('')
    .reverse()
    .map(x => x === '0' ? '1' : '0')
    .join('')
  return `${a}0${b}`
}

function checkSum(str) {
  let result = ''
  for (let i = 0; i < str.length; i += 2) {
    const pair = str.substr(i, 2)
    result += (pair === '11' || pair === '00') ? '1' : '0'
  }
  return result
}