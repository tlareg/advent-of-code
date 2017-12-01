"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const nums = inputStr.split('').map(Number)
const numsLength = nums.length
const lastIdx = numsLength - 1
const comparisionStep = numsLength / 2

const getAnswer = (nums, getComparisionIdx) => nums.reduce((acc, num, idx) =>
  (num === nums[getComparisionIdx(idx)]) ? acc + num : acc, 0)

console.log(getAnswer(nums, idx => idx === lastIdx ? 0 : idx + 1))
console.log(getAnswer(nums, idx => (idx + comparisionStep) % numsLength))