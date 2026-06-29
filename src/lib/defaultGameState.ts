import type { GameState } from '../store/gameStore';

export const defaultGameState: GameState = {
  header: '',
  hostCamera: '',
  round: 1,
  questionNumber: 1,
  timerSeconds: 0,
  activeTeam: 'left',
  revealCorrect: false,
  categories: [],
  mode: 'grid',
  mysteryImage: '',
  emojiPuzzle: '',
  question: '',
  answers: [
    { id: 'A', text: '', correct: false },
    { id: 'B', text: '', correct: false },
    { id: 'C', text: '', correct: false },
    { id: 'D', text: '', correct: false },
  ],
  stageGrid: {
    games: ['', '', '', ''],
    points: [100, 200, 300, 400],
    cells: Array.from({ length: 16 }, (_, index) => ({
      id: `cell-${index}`,
      gameIndex: index % 4,
      pointsIndex: Math.floor(index / 4),
      question: '',
      owner: null,
    })),
    activeQuestionCellId: null,
    specialCellId: null,
    specialQuestion: '',
    stealsRemaining: {
      left: 2,
      right: 2,
    },
    timers: {
      left: {
        remainingSeconds: 360,
        running: false,
      },
      right: {
        remainingSeconds: 360,
        running: false,
      },
    },
    bingoBonus: {
      three: 150,
      four: 300,
    },
  },
  stageHints: {
    activeGameId: 'hint-game-1',
    games: Array.from({ length: 10 }, (_, gameIndex) => ({
      id: `hint-game-${gameIndex + 1}`,
      name: '',
      targetGame: '',
      hints: Array.from({ length: 4 }, () => ({
        text: '',
        mediaUrl: '',
        mediaType: 'none' as const,
      })),
      points: [400, 300, 200, 100],
      revealedCount: 0,
    })),
  },
  stageDraft: {
    phase: 'ban',
    turn: 'left',
    activeQuestionCardId: null,
    bansRemaining: {
      left: 1,
      right: 1,
    },
    cards: Array.from({ length: 12 }, (_, index) => ({
      id: `draft-card-${index + 1}`,
      title: '',
      imageUrl: '',
      question: '',
      status: 'available' as const,
      owner: null,
      points: 0,
    })),
  },
  adminNotes: [],
  leftTeam: {
    id: 'left',
    name: '',
    score: 0,
    players: [
      { id: 'l1', name: '', avatar: '', label: '' },
      { id: 'l2', name: '', avatar: '', label: '' },
    ],
  },
  rightTeam: {
    id: 'right',
    name: '',
    score: 0,
    players: [
      { id: 'r1', name: '', avatar: '', label: '' },
      { id: 'r2', name: '', avatar: '', label: '' },
    ],
  },
};
