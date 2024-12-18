import { GetNeighborsArgs, Grid, posId, Position } from './grid';

export function bfs<T>(
  grid: Grid<T>,
  start: Position,
  isGoal: (pos: Position) => boolean,
  getNeighbors: <T>(args: GetNeighborsArgs<T>) => Position[]
): number | undefined {
  const visited = new Set<string>();
  visited.add(posId(start));

  const queue: Position[] = [start];
  let steps = 0;

  while (queue.length) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const currentPos = queue.shift()!;

      if (isGoal(currentPos)) {
        return steps;
      }

      getNeighbors({
        grid,
        currentPos,
      }).forEach((pos: Position) => {
        const id = posId(pos);
        if (!visited.has(id)) {
          visited.add(id);
          queue.push(pos);
        }
      });
    }

    steps++;
  }
}
