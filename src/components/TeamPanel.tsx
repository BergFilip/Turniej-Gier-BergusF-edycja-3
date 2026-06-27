import type { StageGrid, Team, TeamSide } from '../store/gameStore';
import { PixelFrame } from './PixelFrame';
import { PlayerCard } from './PlayerCard';

type TeamPanelProps = {
  team: Team;
  side: TeamSide;
  active: boolean;
  stageTimer?: StageGrid['timers'][TeamSide];
};

const formatStageTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
};

export const TeamPanel = ({ team, side, active, stageTimer }: TeamPanelProps) => (
  <aside className="flex min-h-0 flex-col gap-3">
    <PixelFrame active={active}>
      <div className="p-4 text-center">
        <div
          className={`text-[10px] uppercase tracking-[0.25em] ${
            side === 'right' ? 'text-[#8bd8ff]/80' : 'text-red-200/70'
          }`}
        >
          {side === 'left' ? 'Lewy sklad' : 'Prawy sklad'}
        </div>
        <h2 className="mt-3 break-words font-pixel text-sm leading-6 text-white sm:text-base">{team.name}</h2>
        <div
          className={`mt-4 font-pixel text-4xl ${
            side === 'right'
              ? 'text-[#8bd8ff] drop-shadow-[0_0_18px_rgba(0,48,73,.95)]'
              : 'text-blood-400 drop-shadow-[0_0_18px_rgba(255,23,23,.9)]'
          }`}
        >
          {team.score}
        </div>
      </div>
    </PixelFrame>

    {stageTimer && (
      <PixelFrame active={stageTimer.running}>
        <div className="p-3 text-center">
          <div className="text-[9px] font-black uppercase tracking-[0.18em] text-red-200/65">Czas etapu</div>
          <div className="mt-2 font-pixel text-2xl text-white">{formatStageTime(stageTimer.remainingSeconds)}</div>
          <div className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-red-100/55">
            {stageTimer.running ? 'czas leci' : 'pauza'}
          </div>
        </div>
      </PixelFrame>
    )}

    <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-1">
      {team.players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  </aside>
);
