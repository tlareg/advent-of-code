"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()
const nums = inputStr.split(/\s+/).map(Number)

console.log(solve(nums))

function solve(nums) {
  const cache = []
  let cacheIdx = -1
  while(cacheIdx === -1) {
    cache.push([...nums])
    nums = spread(nums, nums.indexOf(Math.max(...nums)))
    cacheIdx = cache.findIndex(item => numArrEq(item, nums))
  }
  return {
    firstStar: cache.length,
    secondStar: cache.length - cacheIdx
  }
}

function spread(nums, idx) {
  let n = nums[idx]
  nums[idx] = 0
  while (n) {
    idx = (idx + 1) % nums.length
    nums[idx]++
    n--
  }
  return nums
}

function numArrEq(a, b) {
  for (var i = 0, len = a.length; i < len; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}