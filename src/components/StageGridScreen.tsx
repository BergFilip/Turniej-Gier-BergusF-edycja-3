import { Fragment } from 'react';
import type { StageGrid, Team } from '../store/gameStore';
import { PixelFrame } from './PixelFrame';

type StageGridScreenProps = {
  grid: StageGrid;
  leftTeam: Team;
  rightTeam: Team;
};

const ownerStyles = {
  left: 'border-blood-400 bg-blood-600/90 text-white shadow-neon',
  right: 'border-[#0f5f82] bg-[#003049]/95 text-white shadow-[0_0_22px_rgba(0,48,73,.85)]',
  missed: 'border-amber-300 bg-amber-500/85 text-black shadow-[0_0_22px_rgba(251,191,36,.55)]',
  none: 'border-blood-900/80 bg-black/70 text-red-100/80',
};

export const StageGridScreen = ({ grid, leftTeam, rightTeam }: StageGridScreenProps) => {
  const ownerLabel = {
    left: leftTeam.name,
    right: rightTeam.name,
    missed: 'BRAK POPRAWNEJ',
  };
  const activeCell = grid.cells.find((cell) => cell.id === grid.activeQuestionCellId);
  const activeQuestion = activeCell?.id === grid.specialCellId ? grid.specialQuestion : activeCell?.question;
  const activeGame = activeCell ? grid.games[activeCell.gameIndex] : '';
  const activePoints = activeCell ? grid.points[activeCell.pointsIndex] : 0;

  return (
    <PixelFrame className="h-full">
      <section className="grid min-h-[470px] content-center gap-5 p-4 md:p-6">
        <div className="text-center">
          <div className="text-xs font-black uppercase tracking-[0.28em] text-red-200/70">Etap 1</div>
          <h2 className="mt-3 font-pixel text-lg leading-8 text-white md:text-2xl">Plansza punktow</h2>
        </div>

        {activeCell && (
          <div className="border border-blood-400 bg-blood-950/75 p-5 text-center shadow-neon">
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200/70">
              {activeCell.id === grid.specialCellId ? 'Pytanie specjalne' : 'Pytanie z planszy'}
            </div>
            <div className="mt-3 font-pixel text-base leading-7 text-white md:text-xl">
              {activeGame} / {activePoints} pkt
            </div>
            <p className="mx-auto mt-5 max-w-4xl text-lg font-black leading-8 text-white md:text-2xl">
              {activeQuestion || 'Brak wpisanego pytania.'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-[82px_repeat(4,minmax(0,1fr))] gap-2 md:gap-3">
          <div className="border border-blood-900/70 bg-black/60" />
          {grid.games.map((game, index) => (
            <div
              key={`${game}-${index}`}
              className="pixel-corners flex min-h-[66px] items-center justify-center border border-blood-700 bg-blood-950/80 px-2 text-center font-pixel text-[10px] leading-5 text-white md:text-xs"
            >
              {game}
            </div>
          ))}

          {grid.points.map((points, pointsIndex) => (
            <Fragment key={`row-${pointsIndex}`}>
              <div className="pixel-corners flex min-h-[92px] items-center justify-center border border-blood-700 bg-black/70 font-pixel text-sm text-blood-400 md:text-lg">
                {points}
              </div>
              {grid.games.map((game, gameIndex) => {
                const cell = grid.cells.find(
                  (candidate) => candidate.gameIndex === gameIndex && candidate.pointsIndex === pointsIndex,
                );
                const owner = cell?.owner ?? null;

                return (
                  <div
                    key={`${game}-${points}`}
                    className={`pixel-corners relative flex min-h-[92px] flex-col items-center justify-center overflow-hidden border p-2 text-center transition duration-300 ${
                      owner ? ownerStyles[owner] : ownerStyles.none
                    }`}
                  >
                    <span className="font-pixel text-lg md:text-2xl">{points}</span>
                    {owner && (
                      <span className="mt-3 max-w-full truncate text-[9px] font-black uppercase tracking-[0.12em]">
                        {ownerLabel[owner]}
                      </span>
                    )}
                    {!owner && <span className="mt-3 text-[9px] uppercase tracking-[0.16em] text-red-200/50">open</span>}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </section>
    </PixelFrame>
  );
};
