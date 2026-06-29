import { getDirectImageUrl, getImageEmbedUrl, getVideoEmbedUrl, normalizeMediaUrl } from '../lib/media';
import type { StageHintBox, StageHints } from '../store/gameStore';
import { PixelFrame } from './PixelFrame';

type HintLadderScreenProps = {
  stageHints: StageHints;
};

const hasMedia = (hint: StageHintBox) => hint.mediaType !== 'none' && Boolean(hint.mediaUrl.trim());

const renderMedia = (hint: StageHintBox, revealed: boolean) => {
  const mediaUrl = normalizeMediaUrl(hint.mediaUrl);
  if (hint.mediaType === 'none' || !mediaUrl) return null;

  const mediaClass = `absolute inset-0 h-full w-full transition duration-300 ${
    revealed ? 'blur-0 opacity-95' : 'blur-xl opacity-60'
  }`;

  if (hint.mediaType === 'video') {
    const embedUrl = getVideoEmbedUrl(mediaUrl);
    if (embedUrl) {
      return (
        <iframe
          className={`${mediaClass} object-cover`}
          src={embedUrl}
          title="Hint video"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <video
        className={`${mediaClass} object-cover`}
        src={mediaUrl}
        muted
        loop
        playsInline
        autoPlay={revealed}
        controls={revealed}
      />
    );
  }

  const imageEmbedUrl = getImageEmbedUrl(mediaUrl);
  if (imageEmbedUrl) {
    return (
      <iframe
        className={mediaClass}
        src={imageEmbedUrl}
        title="Hint image gallery"
        allowFullScreen
      />
    );
  }

  return (
    <img
      className={`${mediaClass} object-contain`}
      src={getDirectImageUrl(mediaUrl)}
      alt=""
      referrerPolicy="no-referrer"
    />
  );
};

export const HintLadderScreen = ({ stageHints }: HintLadderScreenProps) => {
  const activeGame = stageHints.games.find((game) => game.id === stageHints.activeGameId) ?? stageHints.games[0];
  const activeIndex = Math.max(0, Math.min(activeGame.revealedCount || 1, activeGame.hints.length) - 1);
  const activeHint = activeGame.hints[activeIndex];
  const revealed = activeGame.revealedCount > 0;
  const activePoints =
    activeGame.revealedCount > 0
      ? activeGame.points[Math.min(activeGame.revealedCount, activeGame.points.length) - 1]
      : activeGame.points[0];
  const mediaVisible = activeHint && hasMedia(activeHint);

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

        <div
          className={`pixel-corners relative min-h-[560px] overflow-hidden border p-[2px] transition duration-300 ${
            revealed ? 'border-blood-400 bg-blood-600 shadow-neon' : 'border-blood-900/80 bg-black/80'
          }`}
        >
          <div className="pixel-corners relative flex h-full min-h-[560px] flex-col justify-between overflow-hidden bg-black/82 p-6 md:p-8">
            {activeHint && renderMedia(activeHint, revealed)}
            {mediaVisible && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/75" />
            )}

            <div className="relative z-10 flex items-center justify-between gap-4">
              <span className="font-pixel text-sm text-blood-400">#{activeIndex + 1}</span>
              <span className="font-pixel text-sm text-white">{activePoints}</span>
            </div>

            {!mediaVisible && (
              <div className="relative z-10 grid flex-1 place-items-center py-8">
                <p
                  className={`max-w-4xl text-center text-xl font-black uppercase leading-10 tracking-[0.08em] text-white transition duration-300 md:text-3xl ${
                    revealed ? 'blur-0' : 'select-none blur-md'
                  }`}
                >
                  {revealed ? activeHint?.text || 'Brak wpisanej podpowiedzi.' : 'PODPOWIEDZ UKRYTA'}
                </p>
              </div>
            )}

            {mediaVisible && !revealed && (
              <div className="relative z-10 grid flex-1 place-items-center">
                <div className="border border-blood-500 bg-black/75 px-6 py-4 font-pixel text-sm text-white shadow-hot">
                  PODPOWIEDZ UKRYTA
                </div>
              </div>
            )}

            <div className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-red-200/60">
              <span>{revealed ? 'odsloniete' : 'zablurzone'}</span>
              <span>/</span>
              <span>
                  {activeGame.revealedCount}/4
              </span>
            </div>
          </div>
        </div>
      </section>
    </PixelFrame>
  );
};
