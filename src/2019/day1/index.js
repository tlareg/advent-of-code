const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

const sum = arr => arr.reduce((sum, x) => sum + x, 0)

const requiredFuel = mass => Math.floor(mass / 3) - 2
const allRequiredFuel = moduleMass => {
  let fuelRequiredForModule = requiredFuel(moduleMass)
  let fuelRequiredForFuel = fuelRequiredForModule;

  while (true) {
    fuelRequiredForFuel = requiredFuel(fuelRequiredForFuel)
    if (fuelRequiredForFuel > 0) {
      fuelRequiredForModule += fuelRequiredForFuel
    } else {
      return fuelRequiredForModule
    }
  }
}

const masses = inputStr.split('\r\n').map(Number)

const firstStar = sum(masses.map(requiredFuel));
console.log({ firstStar })

const secondStar = sum(masses.map(allRequiredFuel));
console.log({ secondStar })
