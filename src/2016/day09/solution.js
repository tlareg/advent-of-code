const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

;(function part1(args) {
  const length = decompress(inputStr)
  console.log(length)
})()

;(function part2(args) {
  const length = decompress(inputStr, decompress)
  console.log(length)
})()

function decompress(str, processFn) {
  // let decompressed = []
  let decompressedLength = 0
  let processedLen = 0
  const arr = str.split('')
  const arrLen = arr.length

  let currentSign = ''
  let i = 0
  let j = 0
  let repeatLen = ''
  let repeatCount = ''
  let repeatSlice = ''
  let readNumResult = {}

  while (i < arrLen) {
    currentSign = arr[i]

    if (currentSign !== '(') {
      // decompressed.push(currentSign)
      ++decompressedLength
      ++i
      continue;
    }

    readNumResult = readNumUntil(arr, i, 'x')
    repeatLen = readNumResult.num
    i = readNumResult.idx

    readNumResult = readNumUntil(arr, i, ')')
    repeatCount = readNumResult.num
    i = readNumResult.idx

    ++i
    processedLen = repeatLen
    repeatSlice = arr.slice(i, i + repeatLen)
    // for (j = 0; j < repeatCount; j++) {
      if (processFn) {
        // repeatSlice = processFn(repeatSlice.join(''))
        processedLen = processFn(repeatSlice.join(''), processFn) 
      }
      // decompressed = decompressed.concat(repeatSlice)
      decompressedLength += (processedLen * repeatCount)
    // }

    i += repeatLen
  }

  // return decompressed
  return decompressedLength
}

function readNumUntil(source, idx, stopSign) {
  let num = ''
  let currentSign = ''
  while (true) {
    currentSign = source[++idx]
    if (currentSign === stopSign) break;
    num += currentSign
  }
  return {
    num: parseInt(num, 10),
    idx
  } 
}
