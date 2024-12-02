const input = 303

console.log(solveFirst(input))
console.log(solveSecond(input))

function solveFirst(input) {
  const { buffer, pos } = spin(2017, input)
  return buffer[(pos + 1) % buffer.length]
}

function solveSecond(input) {
  const step = input
  let pos = 0
  let valAfterZero = undefined
  for (let i = 1; i <= 50000000; ++i) {
    pos = ((pos + step) % i) + 1 // i === buffer.length
    if (pos - 1 === 0) valAfterZero = i
  }
  return valAfterZero
}

function spin(n, step) {
  let buffer = [0]
  let pos = 0
  for (let i = 1; i <= n; ++i) {
    pos = ((pos + step) % buffer.length) + 1 
    buffer.splice(pos, 0, i)
  }
  return { buffer, pos }
}