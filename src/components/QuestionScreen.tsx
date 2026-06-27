import type { GameMode, StageDraft, StageGrid, StageHints, Team } from '../store/gameStore';
import { HintLadderScreen } from './HintLadderScreen';
import { PixelFrame } from './PixelFrame';
import { StageDraftScreen } from './StageDraftScreen';
import { StageGridScreen } from './StageGridScreen';

type QuestionScreenProps = {
  mode: GameMode;
  leftScore: number;
  rightScore: number;
  stageGrid: StageGrid;
  stageHints: StageHints;
  stageDraft: StageDraft;
  leftTeam: Team;
  rightTeam: Team;
};

export const QuestionScreen = ({
  mode,
  leftScore,
  rightScore,
  stageGrid,
  stageHints,
  stageDraft,
  leftTeam,
  rightTeam,
}: QuestionScreenProps) => {
  if (mode === 'grid') {
    return <StageGridScreen grid={stageGrid} leftTeam={leftTeam} rightTeam={rightTeam} />;
  }

  if (mode === 'hints') {
    return <HintLadderScreen stageHints={stageHints} />;
  }

  if (mode === 'draft') {
    return <StageDraftScreen draft={stageDraft} leftTeam={leftTeam} rightTeam={rightTeam} />;
  }

  const winner = leftScore === rightScore ? 'REMIS' : leftScore > rightScore ? 'LEWA DRUZYNA' : 'PRAWA DRUZYNA';
  return (
    <PixelFrame className="h-full">
      <div className="flex min-h-[470px] flex-col items-center justify-center p-8 text-center">
        <div className="text-xs font-black uppercase tracking-[0.28em] text-red-200/70">Final score</div>
        <h2 className="mt-5 font-pixel text-2xl leading-10 text-blood-400 md:text-4xl">{winner}</h2>
        <div className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-4">
          <div className="border border-blood-800/80 bg-black/60 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-red-200/60">Lewi</div>
            <div className="mt-4 font-pixel text-4xl text-white">{leftScore}</div>
          </div>
          <div className="border border-blood-800/80 bg-black/60 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-red-200/60">Prawi</div>
            <div className="mt-4 font-pixel text-4xl text-[#8bd8ff] drop-shadow-[0_0_14px_rgba(0,48,73,.95)]">
              {rightScore}
            </div>
          </div>
        </div>
      </div>
    </PixelFrame>
  );
};
