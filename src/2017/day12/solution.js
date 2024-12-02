"use strict";

const fs = require('fs')
const inputStr = fs.readFileSync('./input.txt').toString()

class Node {
  constructor(id, adjacentIds, groupId) {
    this.id = id
    this.adjacentIds = adjacentIds
    this.groupId = groupId
  }
}

class NodesRepo {
  constructor() {
    this.nodes = {}
  }

  createOrUpdateNode(id, adjacentIds, groupId) {
    const node = this.nodes[id]
    if (node) {
      node.adjacentIds = [...new Set([...node.adjacentIds, ...adjacentIds])]
      node.groupId = node.groupId || groupId
      return node
    }
    return this.nodes[id] = new Node(id, adjacentIds, groupId)
  }
}

class Group {
  constructor(id, nodeIds) {
    this.id = id
    this.nodeIds = nodeIds
  }
}

class GroupsRepo {
  constructor(nodesRepo) {
    this.nextId = 1
    this.groups = {}
    this.nodesRepo = nodesRepo
  }

  createGroup(nodes) {
    const id = this.nextId++
    const group = this.groups[id] = new Group(id, nodes.map(n => n.id))
    nodes.forEach(node => node.groupId = id)
    return group
  }

  updateGroup(id, nodes) {
    const group = this.groups[id]
    group.nodeIds = [...new Set([...group.nodeIds, ...nodes.map(n => n.id)])]
    nodes.forEach(node => node.groupId = id)
    return group
  }

  mergeGroups(groupIds) {
    const newGroup = this.createGroup([])
    groupIds.forEach(id => {
      const nodes = this.groups[id].nodeIds.map(id => this.nodesRepo.nodes[id])
      this.updateGroup(newGroup.id, nodes)
      delete this.groups[id]
    })
  }
}

function solve(inputStr) {
  const nodesRepo = new NodesRepo()
  const groupsRepo = new GroupsRepo(nodesRepo)

  inputStr.replace(/\r\n/g,'\n').split('\n').forEach((line) => {
    const match = line.match(/^(\d+)\s+<->\s+(.+)$/)
    const nodeId = Number(match[1])
    const adjacentIds = match[2].split(/,\s/).map(Number)

    const node = nodesRepo.createOrUpdateNode(nodeId, adjacentIds)
    const adjacentNodes = adjacentIds.map(id =>
      nodesRepo.createOrUpdateNode(id, [nodeId]))

    const allNodes = [...new Set([node, ...adjacentNodes])]
    const groupIds = [...new Set([...allNodes.map(n => n.groupId).filter(gId => !!gId)])]

    if (groupIds.length > 1) {
      groupsRepo.updateGroup(groupIds[0], allNodes)
      groupsRepo.mergeGroups(groupIds)
    } else if (groupIds.length === 1) {
      groupsRepo.updateGroup(groupIds[0], allNodes)
    } else {
      groupsRepo.createGroup(allNodes)
    }
  })

  return {
    firstStar: groupsRepo.groups[nodesRepo.nodes[0].groupId].nodeIds.length,
    secondStar: Object.keys(groupsRepo.groups).length
  }
}

console.log(solve(inputStr))