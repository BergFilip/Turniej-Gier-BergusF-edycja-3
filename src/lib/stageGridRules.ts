import type { StageGrid, TeamSide } from '../store/gameStore';

export type BingoSummary = Record<TeamSide, { three: number; four: number }>;

const emptySummary = (): BingoSummary => ({
  left: { three: 0, four: 0 },
  right: { three: 0, four: 0 },
});

export const getBingoSummary = (grid: StageGrid): BingoSummary => {
  const summary = emptySummary();
  const size = 4;

  const ownerAt = (gameIndex: number, pointsIndex: number) =>
    grid.cells.find((cell) => cell.gameIndex === gameIndex && cell.pointsIndex === pointsIndex)?.owner ?? null;

  const scanLine = (owners: Array<TeamSide | 'missed' | null>) => {
    let index = 0;
    while (index < owners.length) {
      const owner = owners[index];
      if (!owner || owner === 'missed') {
        index += 1;
        continue;
      }

      let length = 1;
      while (index + length < owners.length && owners[index + length] === owner) {
        length += 1;
      }

      if (length >= 4) {
        summary[owner].four += 1;
      } else if (length === 3) {
        summary[owner].three += 1;
      }

      index += length;
    }
  };

  for (let row = 0; row < size; row += 1) {
    scanLine(Array.from({ length: size }, (_, column) => ownerAt(column, row)));
  }

  for (let column = 0; column < size; column += 1) {
    scanLine(Array.from({ length: size }, (_, row) => ownerAt(column, row)));
  }

  return summary;
};
