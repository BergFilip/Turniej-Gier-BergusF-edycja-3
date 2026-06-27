import type { Answer } from '../store/gameStore';

type AnswerTileProps = {
  answer: Answer;
  reveal: boolean;
};

export const AnswerTile = ({ answer, reveal }: AnswerTileProps) => {
  const isCorrect = reveal && answer.correct;
  const isDimmed = reveal && !answer.correct;

  return (
    <div
      className={`pixel-corners group relative min-h-[82px] overflow-hidden border p-[2px] transition duration-300 hover:-translate-y-1 hover:shadow-neon ${
        isCorrect
          ? 'border-blood-400 bg-blood-500 shadow-neon'
          : isDimmed
            ? 'border-zinc-800 bg-zinc-950 opacity-45'
            : 'border-blood-800 bg-blood-950/70'
      }`}
    >
      <div className="pixel-corners flex h-full items-center gap-4 bg-black/82 px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-blood-500/80 bg-blood-950 font-pixel text-sm text-blood-400">
          {answer.id}
        </div>
        <div className="text-sm font-black uppercase leading-6 tracking-[0.08em] text-white md:text-base">{answer.text}</div>
      </div>
    </div>
  );
};
