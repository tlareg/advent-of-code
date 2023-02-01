const INPUT = 'hepxcrrq'

console.log(solve(INPUT))

function solve(input: string) {
  const solutions = []
  let result = input

  while (solutions.length < 2) {
    result = getNextPassword(result)
    if (isValid(result)) {
      solutions.push(result)
    }
  }

  return { solution1: solutions[0], solution2: solutions[1] }
}

function getNextPassword(password: string, pos: number = password.length - 1) {
  let charCode = password.charCodeAt(pos)
  let char = password[pos]
  let newChar

  if (char === 'z') {
    if (pos > 0) {
      password = getNextPassword(password, pos - 1)
    }
    newChar = 'a'
  } else {
    newChar = String.fromCharCode(charCode + 1)
  }

  return `${password.substring(0, pos)}${newChar}${password.substring(pos + 1, password.length)}`;
}

function isValid(pass: string) {
  if (pass.match(/i|o|l/) || !pass.match(/(.)\1.*(.)\2/)) {
    return false
  }

  for (let i = 0; i < pass.length - 2; i++) {
    if (
      pass.charCodeAt(i) == pass.charCodeAt(i + 1) - 1 &&
      pass.charCodeAt(i) == pass.charCodeAt(i + 2) - 2
    ) {
      return true
    }
  }

  return false
}
