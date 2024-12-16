// https://adventofcode.com/2024/day/16

import { readFileSync } from 'fs';
import { Heap } from 'heap-js';

type Coords = {
  y: number;
  x: number;
};

const DIRS = {
  N: { y: -1, x: 0 },
  S: { y: 1, x: 0 },
  E: { y: 0, x: 1 },
  W: { y: 0, x: -1 },
} as const;

type Dir = keyof typeof DIRS;

type NodeId = string;

type Neighbor = {
  id: NodeId;
  cost: number;
};

const solution = solve(readLines(`${__dirname}/input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(map: string[]) {
  const { minFinishCost, minimalPathsCoordsCount } = dijkstra(map);

  return {
    part1: minFinishCost,
    part2: minimalPathsCoordsCount,
  };
}

function dijkstra(map: string[]): {
  minFinishCost: number;
  minimalPathsCoordsCount: number;
} {
  const { queue, costs, parents, finishNodeIds } = initState(map);

  let queueItem: { id: string; cost: number } | undefined;

  while ((queueItem = queue.pop())) {
    updateNeighborsCostsAndParents(queueItem.id);
  }

  const finishCosts = finishNodeIds.map((id) => costs.get(id) ?? Infinity);
  const minFinishCost = Math.min(...finishCosts);
  const allMinimalPaths = finishNodeIds.flatMap((finishNodeId) =>
    costs.get(finishNodeId) === minFinishCost
      ? getAllPathsFromParents(parents, finishNodeId)
      : []
  );
  const uniqueCoordsInMinimalPaths = getUniqueCoords(
    allMinimalPaths.flatMap((p) => p)
  );

  return {
    minFinishCost,
    minimalPathsCoordsCount: uniqueCoordsInMinimalPaths.size,
  };

  function updateNeighborsCostsAndParents(nodeId: NodeId) {
    if (!costs.has(nodeId)) {
      costs.set(nodeId, Infinity);
    }

    const cost = costs.get(nodeId) ?? Infinity;
    const neighbors = getNeighbors(map, nodeId) ?? {};

    neighbors.forEach(({ id: neighborId, cost: neighborEdgeCost }) => {
      const neighborNewCost = cost + neighborEdgeCost;
      if (!costs.has(neighborId)) {
        costs.set(neighborId, Infinity);
      }

      if (neighborNewCost < costs.get(neighborId)!) {
        queue.push({ id: neighborId, cost: neighborNewCost });
        costs.set(neighborId, neighborNewCost);
        parents.set(neighborId, [nodeId]);
      } else if (neighborNewCost === costs.get(neighborId)!) {
        const currentParents = parents.get(neighborId) ?? [];
        parents.set(neighborId, [...currentParents, nodeId]);
      }
    });
  }
}

function initState(map: string[]) {
  const queue = new Heap<{ id: NodeId; cost: number }>(
    (a, b) => a.cost - b.cost
  );
  const costs = new Map<NodeId, number>();
  const parents = new Map<NodeId, Array<NodeId | undefined>>();

  let finishNodeIds: NodeId[] = [];

  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const val = row[x];
      if (val === 'S') {
        const startNodeId = createId({ y, x }, 'E');
        queue.push({ id: startNodeId, cost: 0 });
        costs.set(startNodeId, 0);
      }

      if (val === 'E') {
        finishNodeIds.push(createId({ y, x }, 'E'));
        finishNodeIds.push(createId({ y, x }, 'N'));
        finishNodeIds.forEach((id) => costs.set(id, Infinity));
      }
    }
  }

  return { queue, costs, parents, finishNodeIds };
}

function getNeighbors(map: string[], nodeId: NodeId): Neighbor[] {
  let results: Array<Partial<Neighbor> & Coords & { dir: Dir }> = [];
  const { y, x, dir: currDir } = splitId(nodeId);

  results = Object.entries(DIRS).map(([dir, vector]) => ({
    y: y + vector.y,
    x: x + vector.x,
    dir: dir as Dir,
    cost: Infinity,
  }));

  results = results.filter(({ y, x, dir }) => {
    if (map[y]?.[x] == '#') {
      return false;
    }

    if (currDir === dir) {
      return true;
    }

    if (['N', 'S'].includes(currDir)) {
      return ['W', 'E'].includes(dir!);
    }

    if (['W', 'E'].includes(currDir)) {
      return ['N', 'S'].includes(dir!);
    }

    return true;
  });

  return results.map(({ y, x, dir }) => {
    return {
      id: createId({ y, x }, dir!),
      dir: dir!,
      cost: 1 + (dir === currDir ? 0 : 1000),
    };
  });
}

function getAllPathsFromParents(
  parents: Map<NodeId, Array<NodeId | undefined>>,
  finishNodeId: NodeId
) {
  function buildPaths(nodeId: NodeId): NodeId[][] {
    if (!parents.has(nodeId)) {
      return [[nodeId]];
    }
    const parentNodes = parents.get(nodeId) ?? [];
    const paths = [];
    for (const parent of parentNodes) {
      if (!parent) {
        continue;
      }
      const parentPaths = buildPaths(parent);
      for (const parentPath of parentPaths) {
        paths.push([...parentPath, nodeId]);
      }
    }
    return paths;
  }

  return buildPaths(finishNodeId);
}

function getUniqueCoords(nodes: NodeId[]): Set<string> {
  return new Set(
    nodes.map((id) => {
      const { y, x } = splitId(id);
      return `${y},${x}`;
    })
  );
}

function createId({ y, x }: Coords, dir: Dir) {
  return `${y},${x},${dir}`;
}

function splitId(id: NodeId): { y: number; x: number; dir: Dir } {
  const [y, x, dir] = id.split(',');
  return {
    y: Number(y),
    x: Number(x),
    dir: dir as Dir,
  };
}

function display(map: string[], set: Set<string>) {
  const str = map
    .map((row, y) =>
      row
        .split('')
        .map((v, x) => {
          if (set.has(`${y},${x}`)) {
            return 'O';
          }
          return v;
        })
        .join('')
    )
    .join('\n');

  console.log(str);
}
