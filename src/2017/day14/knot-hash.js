"use strict";

module.exports = knotHash

function knotHash(inputStr) {
  const lens = inputStr.split('')
    .map(n => n.charCodeAt(0))
    .concat([17, 31, 73, 47, 23]);
  const { list: spareHash } = [...Array(64).keys()].reduce(
    ({ list, pos, skip }) => hash(list, lens, pos, skip),
    { list: [...Array(256).keys()], pos: 0, skip: 0 }
  )
  return spare2DenseHash(spareHash).map(num2hex).join('')
}

function hash(list, lens, pos, skip) {
  return lens.reduce(({ list, pos, skip }, len) => {
    if (len > 1) list = reverseSlice(list, pos, len)
    pos = (pos + len + skip++) % list.length
    return { list, pos, skip }
  }, { list, pos, skip})
}

function spare2DenseHash(spare) {
  let dense = []
  for (let i = 0; i < spare.length; i += 16) {
    dense.push(spare.slice(i, i + 16).reduce((acc, n) => acc ^ n))
  }
  return dense
}

function num2hex(n) {
  const hex = n.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

function reverseSlice(list, pos, len) {
  let temp = [...list.slice(pos), ...list.slice(0, pos)];
  temp = [...temp.slice(0, len).reverse(), ...temp.slice(len)];
  return [...temp.slice(-pos), ...temp.slice(0, -pos)];
}