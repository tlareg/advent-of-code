class MovingPart {
  constructor(id, floor) {
    this.id = id
    this.floor = floor
  }
  
  toString() {
    return `${this.id}`
  }
}

class Elevator extends MovingPart {
  constructor() {
    super('E', 0)
    this.movesCounter = 0
    this.floor = 0
    this.content = []
  }

  goUp() {
    this.movesCounter++
    this.floor++
    this.content.forEach(item => item.floor++)
  }

  goDown() {
    this.movesCounter++
    this.floor--
    this.content.forEach(item => item.floor--)
  }
}

class Microchip extends MovingPart {

}

class Generator extends MovingPart {

}

class Building {
  constructor() {
    this.floorsCount = 4
    this.elevator = new Elevator()
    this.movingParts = [
      this.elevator
    ]
  }

  toString() {
    let str = ''
    for (var i = this.floorsCount; i > 0; i--) {
      str += `F${i} ${this.movingParts.filter(p => p.floor === i - 1)} \n`
    }
    return str
  }
}

;(function main() {
  const building = new Building()
  console.log(`${building}`)
  building.elevator.goUp()
  console.log(`${building}`)
  building.elevator.goUp()
  console.log(`${building}`)
  building.elevator.goDown()
  console.log(`${building}`)
})()