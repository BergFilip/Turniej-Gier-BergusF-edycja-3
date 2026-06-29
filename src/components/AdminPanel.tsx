import Eye from 'lucide-react/dist/esm/icons/eye.js';
import Minus from 'lucide-react/dist/esm/icons/minus.js';
import Plus from 'lucide-react/dist/esm/icons/plus.js';
import RefreshCcw from 'lucide-react/dist/esm/icons/refresh-ccw.js';
import Swords from 'lucide-react/dist/esm/icons/swords.js';
import Trophy from 'lucide-react/dist/esm/icons/trophy.js';
import { Fragment, useEffect } from 'react';
import { getBingoSummary } from '../lib/stageGridRules';
import type { CellOwner, DraftPhase, GameMode, TeamSide } from '../store/gameStore';
import { useGameStore } from '../store/gameStore';
import { PixelFrame } from './PixelFrame';

const scoreStep = 10;

const fieldNumber = (value: string) => Number.parseInt(value, 10) || 0;

const formatStageTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
};

type ActionButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
};

const ActionButton = ({ children, onClick, variant = 'ghost' }: ActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition hover:-translate-y-0.5 ${
      variant === 'primary'
        ? 'border-blood-400 bg-blood-600 text-white shadow-hot'
        : variant === 'danger'
          ? 'border-red-900 bg-red-950/70 text-red-100 hover:border-blood-400'
          : 'border-blood-800 bg-black/55 text-red-100 hover:border-blood-400 hover:shadow-neon'
    }`}
  >
    {children}
  </button>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-4 font-pixel text-sm leading-6 text-white">{children}</h2>
);

export const AdminPanel = () => {
  const state = useGameStore();
  const bingo = getBingoSummary(state.stageGrid);
  const activeHintGame =
    state.stageHints.games.find((game) => game.id === state.stageHints.activeGameId) ?? state.stageHints.games[0];
  const draftPickedCount = state.stageDraft.cards.filter((card) => card.status === 'picked').length;
  const draftBannedCount = state.stageDraft.cards.filter((card) => card.status === 'banned').length;

  useEffect(() => {
    if (!state.stageGrid.timers.left.running && !state.stageGrid.timers.right.running) return;

    const intervalId = window.setInterval(() => {
      state.tickStageTimers();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [state, state.stageGrid.timers.left.running, state.stageGrid.timers.right.running]);

  const updateScore = (side: TeamSide, value: string) => {
    state.updateTeam(side, { score: fieldNumber(value) });
  };

  const ownerOptions: Array<{ label: string; value: CellOwner }> = [
    { label: 'Brak', value: null },
    { label: state.leftTeam.name, value: 'left' },
    { label: state.rightTeam.name, value: 'right' },
    { label: 'Nikt nie odpowiedzial', value: 'missed' },
  ];

  return (
    <main className="grid-glow min-h-screen p-4 text-white md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 border-b border-blood-800/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-200/70">Panel administracyjny</p>
            <h1 className="mt-3 font-pixel text-xl leading-9 text-blood-400 md:text-2xl">BERGUSF CONTROL ROOM</h1>
          </div>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-blood-700 bg-black/60 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-100 transition hover:border-blood-400 hover:shadow-neon"
          >
            Widok overlayu
          </a>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_410px]">
          <div className="grid gap-5">
            <PixelFrame>
              <section className="p-5">
                <SectionTitle>Ustawienia gry</SectionTitle>
                <div className="grid gap-4 md:grid-cols-2">
                  <label>
                    <span className="admin-label">Nagłówek</span>
                    <input
                      className="admin-input"
                      value={state.header}
                      onChange={(event) => state.setField('header', event.target.value)}
                    />
                  </label>
                  <label>
                    <span className="admin-label">Tryb ekranu</span>
                    <select
                      className="admin-input"
                      value={state.mode}
                      onChange={(event) => state.setField('mode', event.target.value as GameMode)}
                    >
                      <option value="grid">Etap 1: plansza 4x4</option>
                      <option value="hints">Etap 2: podpowiedzi</option>
                      <option value="draft">Etap 3: draft kart</option>
                      <option value="final">Punktacja końcowa</option>
                    </select>
                  </label>
                  <label className="md:col-span-2">
                    <span className="admin-label">Kamera prowadzącego URL</span>
                    <input
                      className="admin-input"
                      value={state.hostCamera}
                      placeholder="VDO Ninja, /media/kamera.mp4 albo URL obrazka"
                      onChange={(event) => state.setField('hostCamera', event.target.value)}
                    />
                  </label>
                </div>
              </section>
            </PixelFrame>

            <PixelFrame>
              <section className="p-5">
                <SectionTitle>Drużyny i gracze</SectionTitle>
                <div className="grid gap-5 lg:grid-cols-2">
                  {(['left', 'right'] as TeamSide[]).map((side) => {
                    const team = side === 'left' ? state.leftTeam : state.rightTeam;
                    return (
                      <div key={side} className="border border-blood-900/80 bg-black/35 p-4">
                        <label>
                          <span className="admin-label">Nazwa drużyny {side === 'left' ? 'lewej' : 'prawej'}</span>
                          <input
                            className="admin-input"
                            value={team.name}
                            onChange={(event) => state.updateTeam(side, { name: event.target.value })}
                          />
                        </label>
                        <label className="mt-4 block">
                          <span className="admin-label">Wynik</span>
                          <input
                            className="admin-input"
                            type="number"
                            value={team.score}
                            onChange={(event) => updateScore(side, event.target.value)}
                          />
                        </label>
                        <div className="mt-5 grid gap-4">
                          {team.players.map((player) => (
                            <div key={player.id} className="grid gap-3 border-t border-blood-900/80 pt-4">
                              <label>
                                <span className="admin-label">Nazwa gracza</span>
                                <input
                                  className="admin-input"
                                  value={player.name}
                                  onChange={(event) =>
                                    state.updatePlayer(side, player.id, { name: event.target.value })
                                  }
                                />
                              </label>
                              <label>
                                <span className="admin-label">Etykieta</span>
                                <input
                                  className="admin-input"
                                  value={player.label}
                                  onChange={(event) =>
                                    state.updatePlayer(side, player.id, { label: event.target.value })
                                  }
                                />
                              </label>
                              <label>
                                <span className="admin-label">Avatar / kamera URL</span>
                                <input
                                  className="admin-input"
                                  value={player.avatar}
                                  placeholder="https://..."
                                  onChange={(event) =>
                                    state.updatePlayer(side, player.id, { avatar: event.target.value })
                                  }
                                />
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </PixelFrame>

            <PixelFrame>
              <section className="p-5">
                <SectionTitle>Etap 1: plansza 4x4</SectionTitle>
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="border border-blood-900/80 bg-black/35 p-4">
                    <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-red-200/70">
                      Kolumny - gry
                    </h3>
                    <div className="grid gap-3">
                      {state.stageGrid.games.map((game, index) => (
                        <label key={`game-${index}`}>
                          <span className="admin-label">Gra {index + 1}</span>
                          <input
                            className="admin-input"
                            value={game}
                            onChange={(event) => state.updateStageGame(index, event.target.value)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border border-blood-900/80 bg-black/35 p-4">
                    <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-red-200/70">
                      Wiersze - punkty
                    </h3>
                    <div className="grid gap-3">
                      {state.stageGrid.points.map((points, index) => (
                        <label key={`points-${index}`}>
                          <span className="admin-label">Wiersz {index + 1}</span>
                          <input
                            className="admin-input"
                            type="number"
                            value={points}
                            onChange={(event) => state.updateStagePoints(index, fieldNumber(event.target.value))}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div className="border border-blood-900/80 bg-black/35 p-4 lg:col-span-2">
                    <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-red-200/70">
                      Czas etapu 1
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {(['left', 'right'] as TeamSide[]).map((side) => {
                        const team = side === 'left' ? state.leftTeam : state.rightTeam;
                        const timer = state.stageGrid.timers[side];
                        return (
                          <div
                            key={`timer-${side}`}
                            className={`border p-4 ${
                              timer.running
                                ? 'border-blood-400 bg-blood-950/60 shadow-neon'
                                : 'border-blood-900/80 bg-black/45'
                            }`}
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <span className="text-xs font-black uppercase tracking-[0.12em] text-red-100">
                                {team.name}
                              </span>
                              <span className="font-pixel text-lg text-white">
                                {formatStageTime(timer.remainingSeconds)}
                              </span>
                            </div>
                            <label>
                              <span className="admin-label">Sekundy</span>
                              <input
                                className="admin-input"
                                type="number"
                                value={timer.remainingSeconds}
                                onChange={(event) => state.setStageTimer(side, fieldNumber(event.target.value))}
                              />
                            </label>
                            <div className="mt-3 grid grid-cols-3 gap-2">
                              <ActionButton onClick={() => state.startStageTimer(side)}>
                                <Plus className="h-4 w-4" /> Start
                              </ActionButton>
                              <ActionButton onClick={() => state.stopStageTimer(side)}>
                                <Minus className="h-4 w-4" /> Stop
                              </ActionButton>
                              <ActionButton onClick={() => state.resetStageTimer(side)}>
                                <RefreshCcw className="h-4 w-4" /> 6:00
                              </ActionButton>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border border-blood-900/80 bg-black/35 p-4">
                    <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-red-200/70">
                      Kradziez pytania
                    </h3>
                    <div className="grid gap-3">
                      {(['left', 'right'] as TeamSide[]).map((side) => {
                        const team = side === 'left' ? state.leftTeam : state.rightTeam;
                        return (
                          <div key={`steal-${side}`} className="border border-blood-900/80 bg-black/45 p-3">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <span className="text-xs font-black uppercase tracking-[0.12em] text-red-100">
                                {team.name}
                              </span>
                              <span className="font-pixel text-sm text-blood-400">
                                {state.stageGrid.stealsRemaining[side]}/2
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <ActionButton onClick={() => state.useSteal(side)}>
                                <Minus className="h-4 w-4" /> Uzyj
                              </ActionButton>
                              <ActionButton onClick={() => state.restoreSteal(side)}>
                                <Plus className="h-4 w-4" /> Cofnij
                              </ActionButton>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border border-blood-900/80 bg-black/35 p-4">
                    <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-red-200/70">
                      Bonus bingo
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label>
                        <span className="admin-label">Bingo 3</span>
                        <input
                          className="admin-input"
                          type="number"
                          value={state.stageGrid.bingoBonus.three}
                          onChange={(event) => state.updateBingoBonus('three', fieldNumber(event.target.value))}
                        />
                      </label>
                      <label>
                        <span className="admin-label">Bingo 4</span>
                        <input
                          className="admin-input"
                          type="number"
                          value={state.stageGrid.bingoBonus.four}
                          onChange={(event) => state.updateBingoBonus('four', fieldNumber(event.target.value))}
                        />
                      </label>
                    </div>
                    <div className="mt-4 grid gap-3">
                      {(['left', 'right'] as TeamSide[]).map((side) => {
                        const team = side === 'left' ? state.leftTeam : state.rightTeam;
                        return (
                          <div key={`bingo-${side}`} className="border border-blood-900/80 bg-black/45 p-3">
                            <div className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-red-100">
                              {team.name}: 3x {bingo[side].three} / 4x {bingo[side].four}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <ActionButton onClick={() => state.awardBingoBonus(side, 'three')}>
                                <Plus className="h-4 w-4" /> Bingo 3
                              </ActionButton>
                              <ActionButton onClick={() => state.awardBingoBonus(side, 'four')}>
                                <Plus className="h-4 w-4" /> Bingo 4
                              </ActionButton>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]">
                  <div className="border border-blood-900/80 bg-black/35 p-4">
                    <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-red-200/70">
                      Pytanie specjalne spoza kategorii
                    </h3>
                    <div className="grid gap-3 md:grid-cols-[220px_1fr]">
                      <label>
                        <span className="admin-label">Pole specjalne</span>
                        <select
                          className="admin-input"
                          value={state.stageGrid.specialCellId ?? ''}
                          onChange={(event) => state.setStageSpecialCell(event.target.value || null)}
                        >
                          <option value="">Brak</option>
                          {state.stageGrid.cells.map((cell) => (
                            <option key={cell.id} value={cell.id}>
                              {state.stageGrid.games[cell.gameIndex]} / {state.stageGrid.points[cell.pointsIndex]}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span className="admin-label">Treść pytania specjalnego</span>
                        <textarea
                          className="admin-input min-h-24 resize-y"
                          value={state.stageGrid.specialQuestion}
                          onChange={(event) => state.updateStageSpecialQuestion(event.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="grid content-start gap-3 border border-blood-900/80 bg-black/35 p-4">
                    <ActionButton onClick={() => state.setField('mode', 'grid')} variant="primary">
                      <Eye className="h-4 w-4" /> Pokaż etap 1
                    </ActionButton>
                    <ActionButton onClick={state.hideStageCellQuestion}>
                      <Minus className="h-4 w-4" /> Ukryj pytanie
                    </ActionButton>
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <div className="grid min-w-[680px] grid-cols-[76px_repeat(4,minmax(0,1fr))] gap-2">
                    <div />
                    {state.stageGrid.games.map((game, index) => (
                      <div
                        key={`admin-game-${index}`}
                        className="border border-blood-900/80 bg-blood-950/80 p-2 text-center text-[10px] font-black uppercase tracking-[0.12em] text-red-100"
                      >
                        {game}
                      </div>
                    ))}
                    {state.stageGrid.points.map((points, pointsIndex) => (
                      <Fragment key={`admin-row-${pointsIndex}`}>
                        <div className="flex min-h-16 items-center justify-center border border-blood-900/80 bg-black/60 font-pixel text-xs text-blood-400">
                          {points}
                        </div>
                        {state.stageGrid.games.map((game, gameIndex) => {
                          const cell = state.stageGrid.cells.find(
                            (candidate) =>
                              candidate.gameIndex === gameIndex && candidate.pointsIndex === pointsIndex,
                          );
                          const owner = cell?.owner ?? null;

                          return (
                            <div
                              key={`admin-cell-${gameIndex}-${pointsIndex}`}
                              className={`grid min-h-16 gap-2 border p-2 ${
                                owner === 'left'
                                  ? 'border-blood-400 bg-blood-600/70'
                                : owner === 'right'
                                    ? 'border-[#0f5f82] bg-[#003049]/90 text-white'
                                    : owner === 'missed'
                                      ? 'border-amber-300 bg-amber-500/80 text-black'
                                    : 'border-blood-900/80 bg-black/45'
                              }`}
                            >
                              <div className="text-center text-[10px] font-black uppercase tracking-[0.12em]">
                                {game} / {points}
                              </div>
                              <div className="grid grid-cols-4 gap-1">
                                {ownerOptions.map((option) => (
                                  <button
                                    key={`${cell?.id}-${option.value ?? 'none'}`}
                                    type="button"
                                    onClick={() => cell && state.setStageCellOwner(cell.id, option.value)}
                                    className={`min-h-8 rounded border px-2 text-[9px] font-black uppercase tracking-[0.08em] transition hover:-translate-y-0.5 ${
                                      owner === option.value
                                        ? option.value === 'right'
                                          ? 'border-[#8bd8ff] bg-[#003049] text-white'
                                          : option.value === 'missed'
                                            ? 'border-amber-100 bg-amber-400 text-black'
                                            : 'border-white bg-white text-black'
                                        : 'border-blood-900/80 bg-black/60 text-red-100'
                                    }`}
                                    title={option.label}
                                  >
                                    {option.value === 'left'
                                      ? 'L'
                                      : option.value === 'right'
                                        ? 'P'
                                        : option.value === 'missed'
                                          ? 'X'
                                          : '-'}
                                  </button>
                                ))}
                              </div>
                              <textarea
                                className="admin-input min-h-16 resize-y text-[10px]"
                                value={cell?.question ?? ''}
                                placeholder="Pytanie do pola"
                                onChange={(event) => cell && state.updateStageCellQuestion(cell.id, event.target.value)}
                              />
                              <ActionButton onClick={() => cell && state.showStageCellQuestion(cell.id)}>
                                <Eye className="h-4 w-4" /> Pokaż pytanie
                              </ActionButton>
                            </div>
                          );
                        })}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </section>
            </PixelFrame>

            <PixelFrame>
              <section className="p-5">
                <SectionTitle>Etap 2: podpowiedzi</SectionTitle>
                <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
                  <div className="grid gap-4">
                    <label>
                      <span className="admin-label">Aktywna gra</span>
                      <select
                        className="admin-input"
                        value={state.stageHints.activeGameId}
                        onChange={(event) => state.setActiveHintGame(event.target.value)}
                      >
                        {state.stageHints.games.map((game, index) => (
                          <option key={game.id} value={game.id}>
                            {index + 1}. {game.name || game.targetGame || game.id}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="admin-label">Nazwa slotu</span>
                      <input
                        className="admin-input"
                        value={activeHintGame.name}
                        onChange={(event) => state.updateStageHintGameName(event.target.value)}
                      />
                    </label>
                    <label>
                      <span className="admin-label">Poprawna gra</span>
                      <input
                        className="admin-input"
                        value={activeHintGame.targetGame}
                        onChange={(event) => state.setStageHintsTarget(event.target.value)}
                      />
                    </label>
                    {activeHintGame.hints.map((hint, index) => (
                      <div key={`stage-hint-${index}`} className="grid gap-3 border border-blood-900/80 bg-black/35 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-pixel text-sm text-blood-400">#{index + 1}</span>
                          <span className="text-xs font-black uppercase tracking-[0.14em] text-red-100/70">
                            {index < activeHintGame.revealedCount ? 'odsloniete' : 'blur'}
                          </span>
                        </div>
                        <label>
                          <span className="admin-label">Podpowiedz</span>
                          <textarea
                            className="admin-input min-h-20 resize-y"
                            value={hint.text}
                            onChange={(event) => state.updateStageHint(index, event.target.value)}
                          />
                        </label>
                        <div className="grid gap-3 md:grid-cols-[150px_1fr]">
                          <label>
                            <span className="admin-label">Media</span>
                            <select
                              className="admin-input"
                              value={hint.mediaType}
                              onChange={(event) =>
                                state.updateStageHintMediaType(
                                  index,
                                  event.target.value as 'none' | 'image' | 'video',
                                )
                              }
                            >
                              <option value="none">Brak</option>
                              <option value="image">Zdjecie</option>
                              <option value="video">Film</option>
                            </select>
                          </label>
                          <label>
                            <span className="admin-label">URL zdjecia / filmu</span>
                            <input
                              className="admin-input"
                              value={hint.mediaUrl}
                              placeholder="https://..."
                              onChange={(event) => state.updateStageHintMedia(index, event.target.value)}
                            />
                          </label>
                        </div>
                        <label>
                          <span className="admin-label">Punkty po tej podpowiedzi</span>
                          <input
                            className="admin-input"
                            type="number"
                            value={activeHintGame.points[index]}
                            onChange={(event) => state.updateStageHintPoints(index, fieldNumber(event.target.value))}
                          />
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="grid content-start gap-3 border border-blood-900/80 bg-black/35 p-4">
                    <div className="text-center">
                      <div className="text-xs font-black uppercase tracking-[0.16em] text-red-200/70">
                        Odkryte
                      </div>
                      <div className="mt-3 font-pixel text-3xl text-blood-400">
                        {activeHintGame.revealedCount}/4
                      </div>
                    </div>
                    <ActionButton onClick={state.revealNextHint} variant="primary">
                      <Eye className="h-4 w-4" /> Odslon kolejna
                    </ActionButton>
                    <ActionButton onClick={state.hideLastHint}>
                      <Minus className="h-4 w-4" /> Cofnij
                    </ActionButton>
                    <ActionButton onClick={state.resetHints} variant="danger">
                      <RefreshCcw className="h-4 w-4" /> Zabluruj wszystko
                    </ActionButton>
                    <div className="mt-2 border-t border-blood-900/80 pt-3">
                      <div className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-red-200/70">
                        Nalicz aktualne punkty
                      </div>
                      <div className="grid gap-2">
                        <ActionButton onClick={() => state.awardCurrentHintPoints('left')}>
                          <Plus className="h-4 w-4" /> Lewa
                        </ActionButton>
                        <ActionButton onClick={() => state.awardCurrentHintPoints('right')}>
                          <Plus className="h-4 w-4" /> Prawa
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </PixelFrame>

            <PixelFrame>
              <section className="p-5">
                <SectionTitle>Etap 3: draft kart</SectionTitle>
                <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
                  <div className="grid gap-4">
                    <div className="grid gap-3 border border-blood-900/80 bg-black/35 p-4 md:grid-cols-3">
                      <label>
                        <span className="admin-label">Faza</span>
                        <select
                          className="admin-input"
                          value={state.stageDraft.phase}
                          onChange={(event) => state.setDraftPhase(event.target.value as DraftPhase)}
                        >
                          <option value="ban">Bany</option>
                          <option value="pick">Wybieranie</option>
                        </select>
                      </label>
                      <label>
                        <span className="admin-label">Tura</span>
                        <select
                          className="admin-input"
                          value={state.stageDraft.turn}
                          onChange={(event) => state.setDraftTurn(event.target.value as TeamSide)}
                        >
                          <option value="left">{state.leftTeam.name}</option>
                          <option value="right">{state.rightTeam.name}</option>
                        </select>
                      </label>
                      <div className="grid content-end">
                        <ActionButton onClick={state.resetDraft} variant="danger">
                          <RefreshCcw className="h-4 w-4" /> Reset draftu
                        </ActionButton>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {state.stageDraft.cards.map((card, index) => (
                        <div
                          key={card.id}
                          className={`grid gap-3 border p-4 ${
                            card.status === 'banned'
                              ? 'border-red-950 bg-red-950/30'
                              : card.owner === 'left'
                                ? 'border-blood-400 bg-blood-950/45'
                                : card.owner === 'right'
                                  ? 'border-[#0f5f82] bg-[#003049]/45'
                                  : 'border-blood-900/80 bg-black/35'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <span className="font-pixel text-sm text-blood-400">#{index + 1}</span>
                              <span className="ml-3 text-xs font-black uppercase tracking-[0.14em] text-red-100/70">
                                {card.status === 'available'
                                  ? 'wolna'
                                  : card.status === 'banned'
                                    ? `ban: ${card.owner === 'left' ? state.leftTeam.name : state.rightTeam.name}`
                                    : `pick: ${card.owner === 'left' ? state.leftTeam.name : state.rightTeam.name}`}
                              </span>
                            </div>
                            <ActionButton onClick={() => state.clearDraftCard(card.id)}>
                              <RefreshCcw className="h-4 w-4" /> Wyczyść
                            </ActionButton>
                          </div>

                          <div className="grid gap-3 md:grid-cols-[1fr_1fr_120px]">
                            <label>
                              <span className="admin-label">Nazwa gry</span>
                              <input
                                className="admin-input"
                                value={card.title}
                                onChange={(event) => state.updateDraftCard(card.id, { title: event.target.value })}
                              />
                            </label>
                            <label>
                              <span className="admin-label">Grafika URL</span>
                              <input
                                className="admin-input"
                                value={card.imageUrl}
                                placeholder="https://..."
                                onChange={(event) => state.updateDraftCard(card.id, { imageUrl: event.target.value })}
                              />
                            </label>
                            <label>
                              <span className="admin-label">Punkty</span>
                              <input
                                className="admin-input"
                                type="number"
                                disabled={card.status !== 'picked'}
                                value={card.points}
                                onChange={(event) =>
                                  state.updateDraftCard(card.id, { points: fieldNumber(event.target.value) })
                                }
                              />
                            </label>
                          </div>

                          <label>
                            <span className="admin-label">Pytanie do tej karty</span>
                            <textarea
                              className="admin-input min-h-24 resize-y"
                              value={card.question}
                              onChange={(event) => state.updateDraftCard(card.id, { question: event.target.value })}
                            />
                          </label>

                          <div className="grid gap-2 md:grid-cols-5">
                            <ActionButton onClick={() => state.banDraftCard(card.id, 'left')}>
                              <Minus className="h-4 w-4" /> Ban L
                            </ActionButton>
                            <ActionButton onClick={() => state.banDraftCard(card.id, 'right')}>
                              <Minus className="h-4 w-4" /> Ban P
                            </ActionButton>
                            <ActionButton onClick={() => state.pickDraftCard(card.id, state.stageDraft.turn)} variant="primary">
                              <Plus className="h-4 w-4" /> Pick tury
                            </ActionButton>
                            <ActionButton onClick={() => state.pickDraftCard(card.id, 'left')}>Pick L</ActionButton>
                            <ActionButton onClick={() => state.pickDraftCard(card.id, 'right')}>Pick P</ActionButton>
                          </div>

                          {card.status === 'picked' && (
                            <div className="grid gap-2 md:grid-cols-2">
                              <ActionButton onClick={() => state.showDraftQuestion(card.id)} variant="primary">
                                <Eye className="h-4 w-4" /> Pokaż pytanie
                              </ActionButton>
                              <ActionButton onClick={() => state.awardDraftCardPoints(card.id)} variant="primary">
                                <Trophy className="h-4 w-4" /> Nalicz {card.points} pkt
                              </ActionButton>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid content-start gap-3 border border-blood-900/80 bg-black/35 p-4">
                    <div className="text-center">
                      <div className="text-xs font-black uppercase tracking-[0.16em] text-red-200/70">
                        Status draftu
                      </div>
                      <div className="mt-3 font-pixel text-3xl text-blood-400">
                        {draftPickedCount}/10
                      </div>
                      <div className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-red-100/70">
                        Wybrane gry
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 border-t border-blood-900/80 pt-3 text-center">
                      <div>
                        <div className="font-pixel text-xl text-white">{draftBannedCount}/2</div>
                        <div className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-red-200/70">
                          Bany
                        </div>
                      </div>
                      <div>
                        <div className="font-pixel text-xl text-white">
                          {state.stageDraft.bansRemaining.left}/{state.stageDraft.bansRemaining.right}
                        </div>
                        <div className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-red-200/70">
                          Ban L/P
                        </div>
                      </div>
                    </div>
                    <ActionButton onClick={() => state.setField('mode', 'draft')} variant="primary">
                      <Eye className="h-4 w-4" /> Pokaż etap 3
                    </ActionButton>
                    <ActionButton onClick={state.hideDraftQuestion}>
                      <Minus className="h-4 w-4" /> Ukryj pytanie
                    </ActionButton>
                    <ActionButton onClick={() => state.setDraftTurn(state.stageDraft.turn === 'left' ? 'right' : 'left')}>
                      <Swords className="h-4 w-4" /> Zmień turę
                    </ActionButton>
                  </div>
                </div>
              </section>
            </PixelFrame>
          </div>

          <div className="grid content-start gap-5">
            <PixelFrame>
              <section className="p-5">
                <SectionTitle>Szybkie akcje</SectionTitle>
                <div className="grid gap-3">
                  <ActionButton onClick={() => state.addScore('left', scoreStep)} variant="primary">
                    <Plus className="h-4 w-4" /> Punkty lewej
                  </ActionButton>
                  <ActionButton onClick={() => state.addScore('right', scoreStep)} variant="primary">
                    <Plus className="h-4 w-4" /> Punkty prawej
                  </ActionButton>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton onClick={() => state.addScore('left', -scoreStep)}>
                      <Minus className="h-4 w-4" /> Lewa
                    </ActionButton>
                    <ActionButton onClick={() => state.addScore('right', -scoreStep)}>
                      <Minus className="h-4 w-4" /> Prawa
                    </ActionButton>
                  </div>
                  <ActionButton onClick={() => state.setField('mode', 'final')}>
                    <Trophy className="h-4 w-4" /> Finał
                  </ActionButton>
                  <ActionButton onClick={state.resetGame} variant="danger">
                    <RefreshCcw className="h-4 w-4" /> Reset gry
                  </ActionButton>
                </div>
              </section>
            </PixelFrame>

            <PixelFrame>
              <section className="p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <SectionTitle>Notatnik odpowiedzi</SectionTitle>
                  <button
                    type="button"
                    onClick={state.addAdminNote}
                    className="inline-flex min-h-9 items-center justify-center rounded-md border border-blood-800 bg-black/55 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-red-100 transition hover:border-blood-400 hover:shadow-neon"
                  >
                    <Plus className="h-4 w-4" /> Dodaj
                  </button>
                </div>
                <div className="grid gap-3">
                  {state.adminNotes.length === 0 && (
                    <div className="border border-blood-900/80 bg-black/35 p-4 text-center text-xs font-black uppercase tracking-[0.14em] text-red-200/60">
                      Brak zapisanych odpowiedzi
                    </div>
                  )}
                  {state.adminNotes.map((note, index) => (
                    <div key={note.id} className="grid gap-3 border border-blood-900/80 bg-black/35 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-pixel text-sm text-blood-400">#{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => state.removeAdminNote(note.id)}
                          className="inline-flex min-h-8 items-center justify-center rounded-md border border-red-900 bg-red-950/50 px-2 text-[10px] font-black uppercase tracking-[0.12em] text-red-100 transition hover:border-blood-400"
                        >
                          <Minus className="h-4 w-4" /> Usuń
                        </button>
                      </div>
                      <label>
                        <span className="admin-label">Które pytanie</span>
                        <input
                          className="admin-input"
                          value={note.questionLabel}
                          placeholder="np. Etap 1 / Minecraft / 200"
                          onChange={(event) => state.updateAdminNote(note.id, { questionLabel: event.target.value })}
                        />
                      </label>
                      <label>
                        <span className="admin-label">Odpowiedź</span>
                        <textarea
                          className="admin-input min-h-24 resize-y"
                          value={note.answer}
                          placeholder="Tu wpisz poprawną odpowiedź albo własną notatkę"
                          onChange={(event) => state.updateAdminNote(note.id, { answer: event.target.value })}
                        />
                      </label>
                    </div>
                  ))}
                  {state.adminNotes.length > 0 && (
                    <ActionButton onClick={state.clearAdminNotes} variant="danger">
                      <RefreshCcw className="h-4 w-4" /> Wyczyść notatki
                    </ActionButton>
                  )}
                </div>
              </section>
            </PixelFrame>
          </div>
        </div>
      </div>
    </main>
  );
};
