import Clock3 from 'lucide-react/dist/esm/icons/clock-3.js';
import { PixelFrame } from './PixelFrame';

type TimerProps = {
  seconds: number;
};

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
};

export const Timer = ({ seconds }: TimerProps) => (
  <PixelFrame className="min-w-[168px]">
    <div className="flex items-center justify-center gap-3 px-4 py-3">
      <Clock3 className="h-5 w-5 text-blood-400" />
      <span className="font-pixel text-xl text-white">{formatTime(seconds)}</span>
    </div>
  </PixelFrame>
);
