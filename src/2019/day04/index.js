const input = '136818-685979'
const [start, end] = input.split('-').map(Number)

const canBePass = n => {
  n = String(n)
  let twoSameDigits = false

  for (let i = 0; i <= n.length; i++) {
    const currentDigit = n[i]
    const prevDigit = n[i - 1]
    if (prevDigit > currentDigit) return false
    if (prevDigit === currentDigit) {
      twoSameDigits = true
    }
  }

  return twoSameDigits
}

const canBePass2 = n => {
  n = String(n)
  let twoSameDigits = false

  for (let i = 0; i <= n.length; i++) {
    const currentDigit = n[i]
    const prevPrevDigit = n[i - 2]
    const prevDigit = n[i - 1]
    const nextDigit = n[i + 1]

    if (prevDigit > currentDigit) return false

    if (
      prevDigit === currentDigit &&
      (nextDigit === undefined || currentDigit !== nextDigit) &&
      prevPrevDigit !== prevDigit
    ) {
      twoSameDigits = true
    }
  }

  return twoSameDigits
}

let possiblePassCount = 0
let possiblePass2Count = 0

for (let i = start; i <= end; i++) {
  if (canBePass(i)) {
    possiblePassCount++
  }
  if (canBePass2(i)) {
    possiblePass2Count++
  }
}

console.log({ possiblePassCount, possiblePass2Count })
