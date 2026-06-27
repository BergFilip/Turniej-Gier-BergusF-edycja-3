import type { GameState } from '../store/gameStore';

export const defaultGameState: GameState = {
  header: 'Turniej gier BergusF edycja 3',
  round: 2,
  questionNumber: 5,
  timerSeconds: 75,
  activeTeam: 'left',
  revealCorrect: false,
  categories: [],
  mode: 'grid',
  mysteryImage:
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
  emojiPuzzle: '🧱 ⚔️ 🌋 💍',
  question: 'Która gra pasuje do zaszyfrowanej sceny?',
  answers: [
    { id: 'A', text: 'Elden Ring', correct: false },
    { id: 'B', text: 'DOOM Eternal', correct: false },
    { id: 'C', text: 'The Legend of Zelda', correct: true },
    { id: 'D', text: 'Hades', correct: false },
  ],
  stageGrid: {
    games: ['Minecraft', 'Cyberpunk', 'Hades', 'Portal'],
    points: [100, 200, 300, 400],
    cells: Array.from({ length: 16 }, (_, index) => ({
      id: `cell-${index}`,
      gameIndex: index % 4,
      pointsIndex: Math.floor(index / 4),
      question: `Pytanie za ${[100, 200, 300, 400][Math.floor(index / 4)]} pkt z kategorii ${
        ['Minecraft', 'Cyberpunk', 'Hades', 'Portal'][index % 4]
      }`,
      owner: null,
    })),
    activeQuestionCellId: null,
    specialCellId: 'cell-5',
    specialQuestion: 'Pytanie specjalne spoza kategorii. Tutaj wpisz niespodzianke dla druzyn.',
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
      name: `Gra ${gameIndex + 1}`,
      targetGame: gameIndex === 0 ? 'Stardew Valley' : '',
      hints:
        gameIndex === 0
          ? [
              {
                text: 'Gra zaczyna sie od przeprowadzki w spokojniejsze miejsce.',
                mediaUrl: '',
                mediaType: 'none' as const,
              },
              {
                text: 'Wazne sa relacje z mieszkancami i codzienna rutyna.',
                mediaUrl: '',
                mediaType: 'none' as const,
              },
              {
                text: 'Mozna lowic ryby, kopac w kopalni i ulepszac narzedzia.',
                mediaUrl: '',
                mediaType: 'none' as const,
              },
              {
                text: 'Dostajesz stara farme po dziadku.',
                mediaUrl: '',
                mediaType: 'none' as const,
              },
            ]
          : Array.from({ length: 4 }, (_, hintIndex) => ({
              text: `Podpowiedz ${hintIndex + 1}`,
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
    cards: [
      'Minecraft',
      'Hades',
      'Portal 2',
      'Celeste',
      'Hollow Knight',
      'Cyberpunk 2077',
      'Stardew Valley',
      'DOOM Eternal',
      'Elden Ring',
      'The Witcher 3',
      'Baldur\'s Gate 3',
      'League of Legends',
    ].map((title, index) => ({
      id: `draft-card-${index + 1}`,
      title,
      imageUrl: '',
      question: `Pytanie do gry: ${title}`,
      status: 'available' as const,
      owner: null,
      points: 0,
    })),
  },
  leftTeam: {
    id: 'left',
    name: 'RED PIXELS',
    score: 0,
    players: [
      { id: 'l1', name: 'Nova', avatar: '', label: 'Kapitan' },
      { id: 'l2', name: 'Kiro', avatar: '', label: 'Lore hunter' },
    ],
  },
  rightTeam: {
    id: 'right',
    name: 'BLACK OPS',
    score: 0,
    players: [
      { id: 'r1', name: 'Vega', avatar: '', label: 'Speedrun' },
      { id: 'r2', name: 'Mira', avatar: '', label: 'Indie radar' },
    ],
  },
};
