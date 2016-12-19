class Node {
  constructor(val) {
    this.next = null
    this.prev = null
    this.val = val
  }
}

class LinkedList {
  constructor() {
    this.first = null
    this.last = null
    this.length = 0
  }

  add(node) {
    if (this.first === null) {
      this.first = node.prev = node
      this.last = node.next = node
    } else {
      node.prev = this.last
      node.next = this.first
      this.first.prev = node
      this.last.next = node
      this.last = node
    }
    this.length++
  }

  remove(node) {
    if (this.length > 1) {
      node.prev.next = node.next
      node.next.prev = node.prev
      if (node === this.first) this.first = node.next
      if (node === this.last) this.last = node.prev
    } else if (this.first === node) {
      this.first = null
      this.last = null
    }
    node.prev = null
    node.next = null
    this.length--
  }

  forEach(fn) {
    let node = this.first
    while (this.length--) {
      fn(node)
      node = node.next
    }
  }
}

const input = 3005290
// const input = 5
const list = new LinkedList()

;[...Array(input).keys()].forEach(i => list.add(new Node(i)))

let node = list.first
do {
  list.remove(node.next)
  node = node.next
} while(node !== node.next)

console.log(`Part 1: ${node.val + 1}`)
