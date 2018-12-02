const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const nums = inputStr.split('\r\n').map(Number)

const firstStar = nums => nums.reduce((acc, n) => acc + n, 0)

console.log(`first star: ${firstStar(nums)}`)

const secondStar = nums => {
  let i = 0
  let sum = 0
  let num
  const cache = {}

  while (true) {
    num = nums[i]
    sum += num
    if (cache[sum]) break
    cache[sum] = true
    i = i >= nums.length - 1 ? 0 : i + 1
  }

  return sum
}

console.log(`second star: ${secondStar(nums)}`)


