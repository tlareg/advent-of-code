export type Position = {
  y: number;
  x: number;
};

export type Grid<T> = T[][];

export const DIRS = {
  N: { y: -1, x: 0 },
  S: { y: 1, x: 0 },
  E: { y: 0, x: 1 },
  W: { y: 0, x: -1 },
} as const;

export const DIAG_DIRS = {
  N: { y: -1, x: 0 },
  NE: { y: -1, x: 1 },
  E: { y: 0, x: 1 },
  SE: { y: 1, x: 1 },
  S: { y: 1, x: 0 },
  SW: { y: 1, x: -1 },
  W: { y: 0, x: -1 },
  NW: { y: -1, x: -1 },
} as const;

export function posId({ y, x }: Position) {
  return `${y},${x}`;
}

export function displayGrid<T>(grid: Grid<T>) {
  console.log(grid.map((row) => row.join('')).join('\n'));
}

export function iterateGrid<T>(
  grid: Grid<T>,
  callback: (value: T, position: Position) => void
) {
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      callback(row[x], { y, x });
    }
  }
}

export function mapGrid<T>(
  grid: Grid<T>,
  callback: (value: T, position: Position) => T
) {
  const newGrid: Grid<T> = [];

  iterateGrid<T>(grid, (value, position) => {
    const { y, x } = position;

    if (!newGrid[y]) {
      newGrid[y] = [];
    }

    newGrid[y][x] = callback(value, position);
  });

  return newGrid;
}

export function findOnGrid<T>(
  grid: Grid<T>,
  predicate: (value: T, position: Position) => boolean
): Position | undefined {
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      if (predicate(row[x], { y, x })) {
        return { y, x };
      }
    }
  }
}

export type GetNeighborsArgs<T> = {
  grid: Grid<T>;
  currentPos: Position;
  isNeighborAllowed?: (value: T, p: Position) => boolean;
  dirs?: Record<string, Position>;
};

export function getNeighbors<T>({
  grid,
  currentPos,
  isNeighborAllowed,
  dirs,
}: GetNeighborsArgs<T>): Position[] {
  const { y, x } = currentPos;

  return Object.entries(dirs ?? DIRS)
    .map(([_dir, vector]) => ({
      y: y + vector.y,
      x: x + vector.x,
    }))
    .filter(
      ({ y, x }) =>
        y >= 0 &&
        x >= 0 &&
        y < grid.length &&
        x < grid[0].length &&
        (isNeighborAllowed?.(grid[y]?.[x], { y, x }) ?? true)
    );
}
