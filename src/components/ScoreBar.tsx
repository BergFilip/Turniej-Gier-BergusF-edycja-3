import type { GameState } from '../store/gameStore';
import { Timer } from './Timer';

type ScoreBarProps = Pick<
  GameState,
  'header' | 'round' | 'questionNumber' | 'timerSeconds' | 'leftTeam' | 'rightTeam'
> & {
  compact?: boolean;
};

export const ScoreBar = ({
  header,
  round,
  questionNumber,
  timerSeconds,
  leftTeam,
  rightTeam,
  compact,
}: ScoreBarProps) => (
  <header className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
    {compact ? (
      <div className="hidden lg:block" />
    ) : (
      <div className="order-2 flex items-center justify-center gap-3 lg:order-1 lg:justify-start">
        <span className="font-pixel text-lg text-blood-400">{leftTeam.score}</span>
        <span className="max-w-[220px] truncate text-sm font-black uppercase tracking-[0.18em] text-white/80">
          {leftTeam.name}
        </span>
      </div>
    )}

    <div className="order-1 text-center lg:order-2">
      <h1 className="font-pixel text-base leading-7 text-white drop-shadow-[0_0_16px_rgba(255,23,23,.75)] md:text-xl">
        {header}
      </h1>
      {!compact && (
        <div className="mt-2 text-xs font-black uppercase tracking-[0.22em] text-red-200/65">
          Runda {round} / Pytanie {questionNumber}
        </div>
      )}
    </div>

    {compact ? (
      <div className="hidden lg:block" />
    ) : (
      <div className="order-3 flex items-center justify-center gap-3 lg:justify-end">
        <span className="max-w-[220px] truncate text-sm font-black uppercase tracking-[0.18em] text-white/80">
          {rightTeam.name}
        </span>
        <span className="font-pixel text-lg text-[#8bd8ff] drop-shadow-[0_0_12px_rgba(0,48,73,.95)]">
          {rightTeam.score}
        </span>
      </div>
    )}

    {!compact && (
      <div className="order-4 flex justify-center lg:col-span-3">
        <Timer seconds={timerSeconds} />
      </div>
    )}
  </header>
);
