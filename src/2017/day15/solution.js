console.log(solve(40000000))
console.log(solve(5000000, 4, 8))

function solve(numOfPairs, divA = 1, divB = 1) {
  const factorA = 16807
  const factorB = 48271
  const mainDivisor = 2147483647
  let valA = 289
  let valB = 629
  let sum = 0

  const generateNext = (val, factor, div) => {
    val = val * factor % mainDivisor
    return (val % div) ? generateNext(val, factor, div) : val
  } 

  for (let i = 0; i < numOfPairs; ++i) {
    valA = generateNext(valA, factorA, divA)
    valB = generateNext(valB, factorB, divB)
    if ((valA & 0xFFFF) == (valB & 0xFFFF)) {
      sum++
    }
  }

  return sum
}