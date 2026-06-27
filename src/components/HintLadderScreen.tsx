import { getVideoEmbedUrl, normalizeMediaUrl } from '../lib/media';
import type { StageHintBox, StageHints } from '../store/gameStore';
import { PixelFrame } from './PixelFrame';

type HintLadderScreenProps = {
  stageHints: StageHints;
};

const renderMedia = (hint: StageHintBox, revealed: boolean) => {
  const mediaUrl = normalizeMediaUrl(hint.mediaUrl);
  if (hint.mediaType === 'none' || !mediaUrl) return null;

  const mediaClass = `absolute inset-0 h-full w-full object-cover transition duration-300 ${
    revealed ? 'blur-0 opacity-95' : 'blur-xl opacity-60'
  }`;

  if (hint.mediaType === 'video') {
    const embedUrl = getVideoEmbedUrl(mediaUrl);
    if (embedUrl) {
      return (
        <iframe
          className={mediaClass}
          src={embedUrl}
          title="Hint video"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <video
        className={mediaClass}
        src={mediaUrl}
        muted
        loop
        playsInline
        autoPlay={revealed}
        controls={revealed}
      />
    );
  }

  return <img className={mediaClass} src={mediaUrl} alt="" referrerPolicy="no-referrer" />;
};

export const HintLadderScreen = ({ stageHints }: HintLadderScreenProps) => {
  const activeGame = stageHints.games.find((game) => game.id === stageHints.activeGameId) ?? stageHints.games[0];
  const activePoints =
    activeGame.revealedCount > 0
      ? activeGame.points[Math.min(activeGame.revealedCount, activeGame.points.length) - 1]
      : activeGame.points[0];

  return (
    <PixelFrame className="h-full">
      <section className="grid min-h-[470px] content-center gap-5 p-4 md:p-6">
        <div className="text-center">
          <div className="text-xs font-black uppercase tracking-[0.28em] text-red-200/70">Etap 2</div>
          <h2 className="mt-3 font-pixel text-lg leading-8 text-white md:text-2xl">Co to za gra?</h2>
          <div className="mt-4 inline-flex items-center justify-center border border-blood-800/80 bg-black/60 px-5 py-3">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-200/70">Pula za odpowiedz</span>
            <span className="ml-4 font-pixel text-2xl text-blood-400">{activePoints}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {activeGame.hints.map((hint, index) => {
            const revealed = index < activeGame.revealedCount;
            return (
              <div
                key={`hint-${activeGame.id}-${index}`}
                className={`pixel-corners relative min-h-[210px] overflow-hidden border p-[2px] transition duration-300 ${
                  revealed ? 'border-blood-400 bg-blood-600 shadow-neon' : 'border-blood-900/80 bg-black/80'
                }`}
              >
                <div className="pixel-corners relative flex h-full min-h-[210px] flex-col justify-between overflow-hidden bg-black/82 p-5">
                  {renderMedia(hint, revealed)}
                  {hint.mediaType !== 'none' && hint.mediaUrl.trim() && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/70" />
                  )}
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <span className="font-pixel text-sm text-blood-400">#{index + 1}</span>
                    <span className="font-pixel text-sm text-white">{activeGame.points[index]}</span>
                  </div>
                  {!(hint.mediaType !== 'none' && hint.mediaUrl.trim()) && (
                    <div className="relative z-10 mt-4 grid gap-4">
                      <p
                        className={`text-center text-sm font-black uppercase leading-7 tracking-[0.08em] text-white transition duration-300 md:text-base ${
                          revealed ? 'blur-0' : 'select-none blur-md'
                        }`}
                      >
                        {revealed ? hint.text : 'PODPOWIEDZ UKRYTA'}
                      </p>
                    </div>
                  )}
                  <div className="relative z-10 mt-5 text-center text-[10px] font-black uppercase tracking-[0.18em] text-red-200/60">
                    {revealed ? 'odsloniete' : 'zablurzone'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-[10px] font-black uppercase tracking-[0.18em] text-red-200/60">
          {activeGame.name} / odkryte podpowiedzi: {activeGame.revealedCount}/4
        </div>
      </section>
    </PixelFrame>
  );
};
