import type { StageGrid, TeamSide } from '../store/gameStore';
import { PixelFrame } from './PixelFrame';

type StageSideStatsProps = {
  side: TeamSide;
  stealsRemaining: number;
  bingo: { three: number; four: number };
  bingoBonus: StageGrid['bingoBonus'];
};

export const StageSideStats = ({ side, stealsRemaining, bingo, bingoBonus }: StageSideStatsProps) => {
  const accent = side === 'right' ? 'text-[#8bd8ff]' : 'text-blood-400';

  return (
    <aside className="grid content-start gap-3">
      <PixelFrame>
        <div className="p-3 text-center">
          <div className="text-[9px] font-black uppercase tracking-[0.18em] text-red-200/65">Kradzieze</div>
          <div className={`mt-3 font-pixel text-3xl ${accent}`}>{stealsRemaining}/2</div>
        </div>
      </PixelFrame>

      <PixelFrame>
        <div className="p-3 text-center">
          <div className="text-[9px] font-black uppercase tracking-[0.18em] text-red-200/65">Bingo</div>
          <div className="mt-3 grid gap-2">
            <div className="border border-blood-900/70 bg-black/45 p-3">
              <div className={`font-pixel text-2xl ${accent}`}>{bingo.three}</div>
              <div className="mt-2 text-[8px] font-black uppercase tracking-[0.12em] text-red-200/60">
                3x / +{bingoBonus.three}
              </div>
            </div>
            <div className="border border-blood-900/70 bg-black/45 p-3">
              <div className={`font-pixel text-2xl ${accent}`}>{bingo.four}</div>
              <div className="mt-2 text-[8px] font-black uppercase tracking-[0.12em] text-red-200/60">
                4x / +{bingoBonus.four}
              </div>
            </div>
          </div>
        </div>
      </PixelFrame>
    </aside>
  );
};
