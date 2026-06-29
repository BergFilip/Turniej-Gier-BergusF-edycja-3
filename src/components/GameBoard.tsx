import { useEffect } from 'react';
import { getBingoSummary } from '../lib/stageGridRules';
import { useGameStore } from '../store/gameStore';
import { HostCameraPanel } from './HostCameraPanel';
import { QuestionScreen } from './QuestionScreen';
import { ScoreBar } from './ScoreBar';
import { StageSideStats } from './StageSideStats';
import { TeamPanel } from './TeamPanel';

export const GameBoard = () => {
  const state = useGameStore();
  const isStageGrid = state.mode === 'grid';
  const isStageOverlay = state.mode === 'grid' || state.mode === 'hints' || state.mode === 'draft';
  const bingo = getBingoSummary(state.stageGrid);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === 'grafa-game-state') state.hydrateFromStorage();
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [state]);

  return (
    <main className="grid-glow relative min-h-screen overflow-hidden p-3 text-white sm:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blood-500/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="h-full w-full animate-scan bg-gradient-to-b from-transparent via-blood-400/10 to-transparent" />
      </div>
      <div className="absolute left-3 top-24 z-20 hidden w-[22rem] xl:block">
        <HostCameraPanel cameraUrl={state.hostCamera} />
      </div>
      <div className="relative mx-auto flex min-h-[calc(100vh-24px)] max-w-[1800px] flex-col gap-4 sm:min-h-[calc(100vh-40px)]">
        <ScoreBar
          header={state.header}
          round={state.round}
          questionNumber={state.questionNumber}
          timerSeconds={state.timerSeconds}
          leftTeam={state.leftTeam}
          rightTeam={state.rightTeam}
          compact={isStageOverlay}
        />
        <div
          className={`grid flex-1 gap-4 ${
            isStageGrid
              ? 'lg:grid-cols-[132px_250px_1fr_250px_132px] xl:grid-cols-[160px_285px_1fr_285px_160px]'
              : 'lg:grid-cols-[260px_1fr_260px] xl:grid-cols-[310px_1fr_310px]'
          }`}
        >
          {isStageGrid && (
            <StageSideStats
              side="left"
              stealsRemaining={state.stageGrid.stealsRemaining.left}
              bingo={bingo.left}
              bingoBonus={state.stageGrid.bingoBonus}
            />
          )}
          <TeamPanel
            team={state.leftTeam}
            side="left"
            active={state.activeTeam === 'left'}
            stageTimer={isStageGrid ? state.stageGrid.timers.left : undefined}
          />
          <div className="flex min-h-0 flex-col gap-4">
            <QuestionScreen
              mode={state.mode}
              leftScore={state.leftTeam.score}
              rightScore={state.rightTeam.score}
              stageGrid={state.stageGrid}
              stageHints={state.stageHints}
              stageDraft={state.stageDraft}
              leftTeam={state.leftTeam}
              rightTeam={state.rightTeam}
            />
          </div>
          <TeamPanel
            team={state.rightTeam}
            side="right"
            active={state.activeTeam === 'right'}
            stageTimer={isStageGrid ? state.stageGrid.timers.right : undefined}
          />
          {isStageGrid && (
            <StageSideStats
              side="right"
              stealsRemaining={state.stageGrid.stealsRemaining.right}
              bingo={bingo.right}
              bingoBonus={state.stageGrid.bingoBonus}
            />
          )}
        </div>
      </div>
    </main>
  );
};
