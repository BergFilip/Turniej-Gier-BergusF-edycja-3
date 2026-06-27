import type { ReactNode } from 'react';

type PixelFrameProps = {
  children: ReactNode;
  className?: string;
  active?: boolean;
};

export const PixelFrame = ({ children, className = '', active = false }: PixelFrameProps) => (
  <div
    className={`pixel-corners relative border bg-black/68 p-[2px] backdrop-blur-md ${
      active
        ? 'border-blood-400 shadow-neon animate-pulseGlow'
        : 'border-blood-800/80 shadow-[0_0_18px_rgba(118,0,13,.25)]'
    } ${className}`}
  >
    <div className="pixel-corners h-full w-full border border-white/5 bg-gradient-to-br from-white/[0.06] via-black/70 to-blood-950/70">
      {children}
    </div>
  </div>
);
