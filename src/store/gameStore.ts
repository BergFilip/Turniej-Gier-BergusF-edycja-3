import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultGameState } from '../lib/defaultGameState';

export type TeamSide = 'left' | 'right';
export type GameMode = 'grid' | 'hints' | 'draft' | 'final';
export type CellOwner = TeamSide | 'missed' | null;

export type Player = {
  id: string;
  name: string;
  avatar: string;
  label: string;
};

export type Team = {
  id: TeamSide;
  name: string;
  score: number;
  players: Player[];
};

export type Answer = {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  correct: boolean;
};

export type StageGridCell = {
  id: string;
  gameIndex: number;
  pointsIndex: number;
  question: string;
  owner: CellOwner;
};

export type StageGrid = {
  games: string[];
  points: number[];
  cells: StageGridCell[];
  activeQuestionCellId: string | null;
  specialCellId: string | null;
  specialQuestion: string;
  stealsRemaining: Record<TeamSide, number>;
  timers: Record<TeamSide, { remainingSeconds: number; running: boolean }>;
  bingoBonus: {
    three: number;
    four: number;
  };
};

export type HintMediaType = 'none' | 'image' | 'video';

export type StageHintBox = {
  text: string;
  mediaUrl: string;
  mediaType: HintMediaType;
};

export type StageHintGame = {
  id: string;
  name: string;
  targetGame: string;
  hints: StageHintBox[];
  points: number[];
  revealedCount: number;
};

export type StageHints = {
  activeGameId: string;
  games: StageHintGame[];
};

export type DraftPhase = 'ban' | 'pick';
export type DraftCardStatus = 'available' | 'banned' | 'picked';

export type StageDraftCard = {
  id: string;
  title: string;
  imageUrl: string;
  question: string;
  status: DraftCardStatus;
  owner: TeamSide | null;
  points: number;
};

export type StageDraft = {
  phase: DraftPhase;
  turn: TeamSide;
  activeQuestionCardId: string | null;
  bansRemaining: Record<TeamSide, number>;
  cards: StageDraftCard[];
};

export type GameState = {
  header: string;
  round: number;
  questionNumber: number;
  timerSeconds: number;
  activeTeam: TeamSide;
  revealCorrect: boolean;
  categories: string[];
  mode: GameMode;
  mysteryImage: string;
  emojiPuzzle: string;
  question: string;
  answers: Answer[];
  stageGrid: StageGrid;
  stageHints: StageHints;
  stageDraft: StageDraft;
  leftTeam: Team;
  rightTeam: Team;
};

type GameStore = GameState & {
  setField: <K extends keyof GameState>(key: K, value: GameState[K]) => void;
  updateTeam: (side: TeamSide, data: Partial<Team>) => void;
  updatePlayer: (side: TeamSide, playerId: string, data: Partial<Player>) => void;
  updateAnswer: (id: Answer['id'], data: Partial<Answer>) => void;
  updateStageGame: (index: number, value: string) => void;
  updateStagePoints: (index: number, value: number) => void;
  updateStageCellQuestion: (cellId: string, value: string) => void;
  setStageCellOwner: (cellId: string, owner: CellOwner) => void;
  setStageSpecialCell: (cellId: string | null) => void;
  updateStageSpecialQuestion: (value: string) => void;
  showStageCellQuestion: (cellId: string) => void;
  hideStageCellQuestion: () => void;
  useSteal: (side: TeamSide) => void;
  restoreSteal: (side: TeamSide) => void;
  setStageTimer: (side: TeamSide, seconds: number) => void;
  startStageTimer: (side: TeamSide) => void;
  stopStageTimer: (side: TeamSide) => void;
  resetStageTimer: (side: TeamSide) => void;
  tickStageTimers: () => void;
  updateBingoBonus: (size: keyof StageGrid['bingoBonus'], value: number) => void;
  awardBingoBonus: (side: TeamSide, size: keyof StageGrid['bingoBonus']) => void;
  setActiveHintGame: (gameId: string) => void;
  updateStageHintGameName: (value: string) => void;
  updateStageHint: (index: number, value: string) => void;
  updateStageHintMedia: (index: number, value: string) => void;
  updateStageHintMediaType: (index: number, value: HintMediaType) => void;
  updateStageHintPoints: (index: number, value: number) => void;
  setStageHintsTarget: (value: string) => void;
  revealNextHint: () => void;
  hideLastHint: () => void;
  resetHints: () => void;
  awardCurrentHintPoints: (side: TeamSide) => void;
  setDraftPhase: (phase: DraftPhase) => void;
  setDraftTurn: (side: TeamSide) => void;
  updateDraftCard: (cardId: string, data: Partial<StageDraftCard>) => void;
  banDraftCard: (cardId: string, side: TeamSide) => void;
  pickDraftCard: (cardId: string, side: TeamSide) => void;
  clearDraftCard: (cardId: string) => void;
  showDraftQuestion: (cardId: string) => void;
  hideDraftQuestion: () => void;
  awardDraftCardPoints: (cardId: string) => void;
  resetDraft: () => void;
  addScore: (side: TeamSide, amount: number) => void;
  nextQuestion: () => void;
  toggleActiveTeam: () => void;
  showCorrect: () => void;
  resetGame: () => void;
  hydrateFromStorage: () => void;
};

const STORAGE_KEY = 'grafa-game-state';

const readPersistedState = (): Partial<GameState> | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: Partial<GameState> };
    return parsed.state ?? null;
  } catch {
    return null;
  }
};

type LegacyStageHints = Partial<StageHints> & {
  targetGame?: string;
  hints?: string[];
  points?: number[];
  revealedCount?: number;
};

const normalizeStageHints = (current: StageHints, persisted?: LegacyStageHints): StageHints => {
  if (!persisted) return current;

  if (Array.isArray(persisted.games) && persisted.games.length > 0) {
    const games = persisted.games.map((game, gameIndex) => ({
      ...current.games[gameIndex % current.games.length],
      ...game,
      hints: Array.from({ length: 4 }, (_, hintIndex) => ({
        ...current.games[0].hints[hintIndex],
        ...game.hints?.[hintIndex],
      })),
      points: Array.from({ length: 4 }, (_, pointIndex) => game.points?.[pointIndex] ?? current.games[0].points[pointIndex]),
      revealedCount: Math.max(0, Math.min(4, game.revealedCount ?? 0)),
    }));

    return {
      activeGameId: persisted.activeGameId && games.some((game) => game.id === persisted.activeGameId)
        ? persisted.activeGameId
        : games[0].id,
      games,
    };
  }

  if (Array.isArray(persisted.hints)) {
    const firstGame = current.games[0];
    return {
      ...current,
      activeGameId: firstGame.id,
      games: current.games.map((game, gameIndex) =>
        gameIndex === 0
          ? {
              ...firstGame,
              targetGame: persisted.targetGame ?? firstGame.targetGame,
              hints: firstGame.hints.map((hint, hintIndex) => ({
                ...hint,
                text: persisted.hints?.[hintIndex] ?? hint.text,
              })),
              points: firstGame.points.map((points, pointIndex) => persisted.points?.[pointIndex] ?? points),
              revealedCount: Math.max(0, Math.min(4, persisted.revealedCount ?? 0)),
            }
          : game,
      ),
    };
  }

  return current;
};

const mergeGameState = <T extends GameState>(current: T, state: Partial<GameState>) => ({
  ...current,
  ...state,
  mode:
    state.mode === 'grid' || state.mode === 'hints' || state.mode === 'draft' || state.mode === 'final'
      ? state.mode
      : current.mode,
  stageGrid: {
    ...current.stageGrid,
    ...state.stageGrid,
    activeQuestionCellId:
      state.stageGrid && 'activeQuestionCellId' in state.stageGrid
        ? state.stageGrid.activeQuestionCellId
        : current.stageGrid.activeQuestionCellId,
    specialCellId:
      state.stageGrid && 'specialCellId' in state.stageGrid
        ? state.stageGrid.specialCellId
        : current.stageGrid.specialCellId,
    specialQuestion: state.stageGrid?.specialQuestion ?? current.stageGrid.specialQuestion,
    cells: current.stageGrid.cells.map((cell, index) => ({
      ...cell,
      ...state.stageGrid?.cells?.[index],
      question: state.stageGrid?.cells?.[index]?.question ?? cell.question,
    })),
    stealsRemaining: {
      ...current.stageGrid.stealsRemaining,
      ...state.stageGrid?.stealsRemaining,
    },
    timers: {
      left: {
        ...current.stageGrid.timers.left,
        ...state.stageGrid?.timers?.left,
      },
      right: {
        ...current.stageGrid.timers.right,
        ...state.stageGrid?.timers?.right,
      },
    },
    bingoBonus: {
      ...current.stageGrid.bingoBonus,
      ...state.stageGrid?.bingoBonus,
    },
  },
  stageHints: normalizeStageHints(current.stageHints, state.stageHints as LegacyStageHints | undefined),
  stageDraft: {
    ...current.stageDraft,
    ...state.stageDraft,
    bansRemaining: {
      ...current.stageDraft.bansRemaining,
      ...state.stageDraft?.bansRemaining,
    },
    cards: current.stageDraft.cards.map((card, index) => ({
      ...card,
      ...state.stageDraft?.cards?.[index],
      question: state.stageDraft?.cards?.[index]?.question ?? card.question,
      points:
        state.stageDraft?.cards?.[index]?.status === 'picked'
          ? (state.stageDraft?.cards?.[index]?.points ?? card.points)
          : 0,
    })),
  },
});

const mapActiveHintGame = (
  state: GameState,
  mapper: (game: StageHintGame) => StageHintGame,
): Pick<GameState, 'stageHints'> => ({
  stageHints: {
    ...state.stageHints,
    games: state.stageHints.games.map((game) =>
      game.id === state.stageHints.activeGameId ? mapper(game) : game,
    ),
  },
});

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...defaultGameState,
      setField: (key, value) => set({ [key]: value } as Pick<GameState, typeof key>),
      updateTeam: (side, data) =>
        set((state) => ({
          [`${side}Team`]: { ...state[`${side}Team`], ...data },
        }) as Pick<GameState, `${TeamSide}Team`>),
      updatePlayer: (side, playerId, data) =>
        set((state) => ({
          [`${side}Team`]: {
            ...state[`${side}Team`],
            players: state[`${side}Team`].players.map((player) =>
              player.id === playerId ? { ...player, ...data } : player,
            ),
          },
        }) as Pick<GameState, `${TeamSide}Team`>),
      updateAnswer: (id, data) =>
        set((state) => ({
          answers: state.answers.map((answer) =>
            answer.id === id
              ? { ...answer, ...data }
              : data.correct
                ? { ...answer, correct: false }
                : answer,
          ),
        })),
      updateStageGame: (index, value) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            games: state.stageGrid.games.map((game, gameIndex) => (gameIndex === index ? value : game)),
          },
        })),
      updateStagePoints: (index, value) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            points: state.stageGrid.points.map((points, pointsIndex) => (pointsIndex === index ? value : points)),
          },
        })),
      updateStageCellQuestion: (cellId, value) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            cells: state.stageGrid.cells.map((cell) => (cell.id === cellId ? { ...cell, question: value } : cell)),
          },
        })),
      setStageCellOwner: (cellId, owner) =>
        set((state) => {
          const cell = state.stageGrid.cells.find((candidate) => candidate.id === cellId);
          if (!cell || cell.owner === owner) {
            return state;
          }

          const points = state.stageGrid.points[cell.pointsIndex] ?? 0;
          const scoreDelta = (side: TeamSide) => {
            const removePrevious = cell.owner === side ? -points : 0;
            const addNext = owner === side ? points : 0;
            return removePrevious + addNext;
          };
          const leftDelta = scoreDelta('left');
          const rightDelta = scoreDelta('right');

          return {
            stageGrid: {
              ...state.stageGrid,
              cells: state.stageGrid.cells.map((candidate) =>
                candidate.id === cellId ? { ...candidate, owner } : candidate,
              ),
            },
            leftTeam: {
              ...state.leftTeam,
              score: Math.max(0, state.leftTeam.score + leftDelta),
            },
            rightTeam: {
              ...state.rightTeam,
              score: Math.max(0, state.rightTeam.score + rightDelta),
            },
          };
        }),
      setStageSpecialCell: (cellId) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            specialCellId: cellId,
          },
        })),
      updateStageSpecialQuestion: (value) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            specialQuestion: value,
          },
        })),
      showStageCellQuestion: (cellId) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            activeQuestionCellId: cellId,
          },
        })),
      hideStageCellQuestion: () =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            activeQuestionCellId: null,
          },
        })),
      useSteal: (side) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            stealsRemaining: {
              ...state.stageGrid.stealsRemaining,
              [side]: Math.max(0, state.stageGrid.stealsRemaining[side] - 1),
            },
          },
        })),
      restoreSteal: (side) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            stealsRemaining: {
              ...state.stageGrid.stealsRemaining,
              [side]: Math.min(2, state.stageGrid.stealsRemaining[side] + 1),
            },
          },
        })),
      setStageTimer: (side, seconds) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            timers: {
              ...state.stageGrid.timers,
              [side]: {
                ...state.stageGrid.timers[side],
                remainingSeconds: Math.max(0, seconds),
              },
            },
          },
        })),
      startStageTimer: (side) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            timers: {
              ...state.stageGrid.timers,
              [side]: {
                ...state.stageGrid.timers[side],
                running: state.stageGrid.timers[side].remainingSeconds > 0,
              },
            },
          },
        })),
      stopStageTimer: (side) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            timers: {
              ...state.stageGrid.timers,
              [side]: {
                ...state.stageGrid.timers[side],
                running: false,
              },
            },
          },
        })),
      resetStageTimer: (side) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            timers: {
              ...state.stageGrid.timers,
              [side]: {
                remainingSeconds: 360,
                running: false,
              },
            },
          },
        })),
      tickStageTimers: () =>
        set((state) => {
          const tickTimer = (side: TeamSide) => {
            const timer = state.stageGrid.timers[side];
            if (!timer.running) return timer;
            const remainingSeconds = Math.max(0, timer.remainingSeconds - 1);
            return {
              remainingSeconds,
              running: remainingSeconds > 0,
            };
          };

          return {
            stageGrid: {
              ...state.stageGrid,
              timers: {
                left: tickTimer('left'),
                right: tickTimer('right'),
              },
            },
          };
        }),
      updateBingoBonus: (size, value) =>
        set((state) => ({
          stageGrid: {
            ...state.stageGrid,
            bingoBonus: {
              ...state.stageGrid.bingoBonus,
              [size]: value,
            },
          },
        })),
      awardBingoBonus: (side, size) =>
        set((state) => {
          const teamKey = `${side}Team` as const;
          const team = state[teamKey];
          return {
            [teamKey]: {
              ...team,
              score: Math.max(0, team.score + state.stageGrid.bingoBonus[size]),
            },
          } as Pick<GameState, typeof teamKey>;
        }),
      setActiveHintGame: (gameId) =>
        set((state) => ({
          stageHints: {
            ...state.stageHints,
            activeGameId: gameId,
          },
        })),
      updateStageHintGameName: (value) =>
        set((state) =>
          mapActiveHintGame(state, (game) => ({
            ...game,
            name: value,
          })),
        ),
      updateStageHint: (index, value) =>
        set((state) =>
          mapActiveHintGame(state, (game) => ({
            ...game,
            hints: game.hints.map((hint, hintIndex) => (hintIndex === index ? { ...hint, text: value } : hint)),
          })),
        ),
      updateStageHintMedia: (index, value) =>
        set((state) =>
          mapActiveHintGame(state, (game) => ({
            ...game,
            hints: game.hints.map((hint, hintIndex) => (hintIndex === index ? { ...hint, mediaUrl: value } : hint)),
          })),
        ),
      updateStageHintMediaType: (index, value) =>
        set((state) =>
          mapActiveHintGame(state, (game) => ({
            ...game,
            hints: game.hints.map((hint, hintIndex) => (hintIndex === index ? { ...hint, mediaType: value } : hint)),
          })),
        ),
      updateStageHintPoints: (index, value) =>
        set((state) =>
          mapActiveHintGame(state, (game) => ({
            ...game,
            points: game.points.map((points, pointsIndex) => (pointsIndex === index ? value : points)),
          })),
        ),
      setStageHintsTarget: (value) =>
        set((state) =>
          mapActiveHintGame(state, (game) => ({
            ...game,
            targetGame: value,
          })),
        ),
      revealNextHint: () =>
        set((state) =>
          mapActiveHintGame(state, (game) => ({
            ...game,
            revealedCount: Math.min(game.hints.length, game.revealedCount + 1),
          })),
        ),
      hideLastHint: () =>
        set((state) =>
          mapActiveHintGame(state, (game) => ({
            ...game,
            revealedCount: Math.max(0, game.revealedCount - 1),
          })),
        ),
      resetHints: () =>
        set((state) =>
          mapActiveHintGame(state, (game) => ({
            ...game,
            revealedCount: 0,
          })),
        ),
      awardCurrentHintPoints: (side) =>
        set((state) => {
          const activeGame =
            state.stageHints.games.find((game) => game.id === state.stageHints.activeGameId) ?? state.stageHints.games[0];
          const revealedIndex = Math.max(0, Math.min(activeGame.revealedCount, activeGame.points.length) - 1);
          const points = activeGame.revealedCount > 0 ? activeGame.points[revealedIndex] : activeGame.points[0];
          const teamKey = `${side}Team` as const;
          const team = state[teamKey];
          return {
            [teamKey]: {
              ...team,
              score: Math.max(0, team.score + points),
            },
          } as Pick<GameState, typeof teamKey>;
        }),
      setDraftPhase: (phase) =>
        set((state) => ({
          stageDraft: {
            ...state.stageDraft,
            phase,
          },
        })),
      setDraftTurn: (side) =>
        set((state) => ({
          stageDraft: {
            ...state.stageDraft,
            turn: side,
          },
        })),
      updateDraftCard: (cardId, data) =>
        set((state) => ({
          stageDraft: {
            ...state.stageDraft,
            cards: state.stageDraft.cards.map((card) => (card.id === cardId ? { ...card, ...data } : card)),
          },
        })),
      banDraftCard: (cardId, side) =>
        set((state) => {
          const card = state.stageDraft.cards.find((candidate) => candidate.id === cardId);
          if (!card || card.status !== 'available' || state.stageDraft.bansRemaining[side] <= 0) {
            return state;
          }

          const bansRemaining = {
            ...state.stageDraft.bansRemaining,
            [side]: Math.max(0, state.stageDraft.bansRemaining[side] - 1),
          };
          const nextTurn = side === 'left' ? 'right' : 'left';

          return {
            stageDraft: {
              ...state.stageDraft,
              phase: bansRemaining.left === 0 && bansRemaining.right === 0 ? 'pick' : state.stageDraft.phase,
              turn: nextTurn,
              bansRemaining,
              cards: state.stageDraft.cards.map((candidate) =>
                candidate.id === cardId
                  ? { ...candidate, status: 'banned', owner: side, points: 0 }
                  : candidate,
              ),
            },
          };
        }),
      pickDraftCard: (cardId, side) =>
        set((state) => {
          const card = state.stageDraft.cards.find((candidate) => candidate.id === cardId);
          if (!card || card.status !== 'available') return state;

          return {
            stageDraft: {
              ...state.stageDraft,
              phase: 'pick',
              turn: side === 'left' ? 'right' : 'left',
              cards: state.stageDraft.cards.map((candidate) =>
                candidate.id === cardId ? { ...candidate, status: 'picked', owner: side, points: 0 } : candidate,
              ),
            },
          };
        }),
      clearDraftCard: (cardId) =>
        set((state) => ({
          stageDraft: {
            ...state.stageDraft,
            activeQuestionCardId:
              state.stageDraft.activeQuestionCardId === cardId ? null : state.stageDraft.activeQuestionCardId,
            cards: state.stageDraft.cards.map((card) =>
              card.id === cardId ? { ...card, status: 'available', owner: null, points: 0 } : card,
            ),
          },
        })),
      showDraftQuestion: (cardId) =>
        set((state) => ({
          stageDraft: {
            ...state.stageDraft,
            activeQuestionCardId: cardId,
          },
        })),
      hideDraftQuestion: () =>
        set((state) => ({
          stageDraft: {
            ...state.stageDraft,
            activeQuestionCardId: null,
          },
        })),
      awardDraftCardPoints: (cardId) =>
        set((state) => {
          const card = state.stageDraft.cards.find((candidate) => candidate.id === cardId);
          if (!card?.owner || card.status !== 'picked') return state;

          const teamKey = `${card.owner}Team` as const;
          const team = state[teamKey];
          return {
            [teamKey]: {
              ...team,
              score: Math.max(0, team.score + card.points),
            },
          } as Pick<GameState, typeof teamKey>;
        }),
      resetDraft: () =>
        set((state) => ({
          stageDraft: defaultGameState.stageDraft,
          activeTeam: state.activeTeam,
        })),
      addScore: (side, amount) =>
        set((state) => {
          const teamKey = `${side}Team` as const;
          const team = state[teamKey];
          return { [teamKey]: { ...team, score: Math.max(0, team.score + amount) } } as Pick<
            GameState,
            typeof teamKey
          >;
        }),
      nextQuestion: () =>
        set((state) => ({
          questionNumber: state.questionNumber + 1,
          revealCorrect: false,
          activeTeam: state.activeTeam === 'left' ? 'right' : 'left',
        })),
      toggleActiveTeam: () =>
        set((state) => ({ activeTeam: state.activeTeam === 'left' ? 'right' : 'left' })),
      showCorrect: () => set({ revealCorrect: true }),
      resetGame: () =>
        set({
          ...defaultGameState,
          leftTeam: {
            ...defaultGameState.leftTeam,
            score: 0,
          },
          rightTeam: {
            ...defaultGameState.rightTeam,
            score: 0,
          },
        }),
      hydrateFromStorage: () => {
        const stored = readPersistedState();
        if (stored) set((state) => mergeGameState(state, stored));
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        header: state.header,
        round: state.round,
        questionNumber: state.questionNumber,
        timerSeconds: state.timerSeconds,
        activeTeam: state.activeTeam,
        revealCorrect: state.revealCorrect,
        categories: state.categories,
        mode: state.mode,
        mysteryImage: state.mysteryImage,
        emojiPuzzle: state.emojiPuzzle,
        question: state.question,
        answers: state.answers,
        stageGrid: state.stageGrid,
        stageHints: state.stageHints,
        stageDraft: state.stageDraft,
        leftTeam: state.leftTeam,
        rightTeam: state.rightTeam,
      }),
      merge: (persisted, current) => {
        const state = persisted as Partial<GameState>;
        return mergeGameState(current, state);
      },
    },
  ),
);
