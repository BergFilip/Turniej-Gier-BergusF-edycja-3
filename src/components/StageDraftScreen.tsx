import { normalizeMediaUrl } from '../lib/media';
import type { StageDraft, Team } from '../store/gameStore';
import { PixelFrame } from './PixelFrame';

type StageDraftScreenProps = {
  draft: StageDraft;
  leftTeam: Team;
  rightTeam: Team;
};

const ownerLabel = (owner: StageDraft['turn'] | null, leftTeam: Team, rightTeam: Team) => {
  if (owner === 'left') return leftTeam.name;
  if (owner === 'right') return rightTeam.name;
  return 'WOLNA';
};

export const StageDraftScreen = ({ draft, leftTeam, rightTeam }: StageDraftScreenProps) => {
  const pickedCount = draft.cards.filter((card) => card.status === 'picked').length;
  const bannedCount = draft.cards.filter((card) => card.status === 'banned').length;
  const currentTeam = draft.turn === 'left' ? leftTeam : rightTeam;
  const activeQuestionCard = draft.cards.find((card) => card.id === draft.activeQuestionCardId);

  return (
    <PixelFrame className="h-full">
      <div className="flex min-h-[470px] flex-col gap-4 p-4 md:p-5">
        <div className="grid gap-3 border-b border-blood-900/80 pb-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-red-200/70">Etap 3</div>
            <h2 className="mt-2 font-pixel text-lg leading-7 text-blood-400 md:text-2xl">DRAFT GIER</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="border border-blood-900/80 bg-black/55 px-4 py-3">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-red-200/60">Bany</div>
              <div className="mt-2 font-pixel text-xl text-white">{bannedCount}/2</div>
            </div>
            <div className="border border-blood-900/80 bg-black/55 px-4 py-3">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-red-200/60">Picki</div>
              <div className="mt-2 font-pixel text-xl text-white">{pickedCount}/10</div>
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-red-200/70">
              {draft.phase === 'ban' ? 'Faza banow' : 'Faza wyboru'}
            </div>
            <div className="mt-2 font-pixel text-sm leading-6 text-white">{currentTeam.name}</div>
          </div>
        </div>

        {activeQuestionCard && (
          <div
            className={`border p-5 text-center shadow-neon ${
              activeQuestionCard.owner === 'right'
                ? 'border-[#0f5f82] bg-[#003049]/70'
                : 'border-blood-400 bg-blood-950/70'
            }`}
          >
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-red-200/70">
              Pytanie do karty
            </div>
            <div className="mt-3 font-pixel text-base leading-7 text-white md:text-xl">
              {activeQuestionCard.title}
            </div>
            <div className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-red-100/70">
              {ownerLabel(activeQuestionCard.owner, leftTeam, rightTeam)}
              {activeQuestionCard.status === 'picked' ? ` / ${activeQuestionCard.points} pkt` : ''}
            </div>
            <p className="mx-auto mt-5 max-w-4xl text-lg font-black leading-8 text-white md:text-2xl">
              {activeQuestionCard.question || 'Brak wpisanego pytania.'}
            </p>
          </div>
        )}

        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {draft.cards.map((card, index) => {
            const ownedByLeft = card.owner === 'left';
            const ownedByRight = card.owner === 'right';
            const isBanned = card.status === 'banned';
            const isPicked = card.status === 'picked';
            const imageUrl = normalizeMediaUrl(card.imageUrl);

            return (
              <div
                key={card.id}
                className={`relative min-h-40 overflow-hidden border bg-black/65 transition duration-300 ${
                  isBanned
                    ? 'border-red-950 opacity-70 grayscale'
                    : ownedByLeft
                      ? 'border-blood-400 shadow-neon'
                      : ownedByRight
                        ? 'border-[#0f5f82] bg-[#003049]/55 shadow-[0_0_24px_rgba(0,48,73,0.85)]'
                        : 'border-blood-900/90 hover:border-blood-500 hover:shadow-neon'
                }`}
              >
                <div className="absolute left-2 top-2 z-10 rounded-sm border border-blood-900/80 bg-black/75 px-2 py-1 font-pixel text-[10px] text-red-100">
                  {String(index + 1).padStart(2, '0')}
                </div>
                {imageUrl ? (
                  <img src={imageUrl} alt="" referrerPolicy="no-referrer" className="h-24 w-full object-cover opacity-85" />
                ) : (
                  <div className="h-24 bg-[linear-gradient(135deg,rgba(239,68,68,0.35),rgba(10,10,10,0.7)),radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.18),transparent_28%)]" />
                )}
                <div className="grid gap-2 p-3">
                  <div className="min-h-10 font-pixel text-xs leading-5 text-white">{card.title}</div>
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-[0.16em] text-red-200/60">
                        {isBanned ? 'Zbanowane przez' : isPicked ? 'Wybrane przez' : 'Status'}
                      </div>
                      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-red-100">
                        {ownerLabel(card.owner, leftTeam, rightTeam)}
                      </div>
                    </div>
                    <div
                      className={`font-pixel text-lg ${
                        ownedByRight && isPicked ? 'text-[#8bd8ff]' : 'text-blood-400'
                      }`}
                    >
                      {isBanned ? 'BAN' : isPicked ? card.points : 'PKT'}
                    </div>
                  </div>
                </div>
                {isBanned && (
                  <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/35">
                    <div className="-rotate-12 border-2 border-blood-400 bg-black/80 px-5 py-2 font-pixel text-xl text-blood-400 shadow-hot">
                      BAN
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PixelFrame>
  );
};
