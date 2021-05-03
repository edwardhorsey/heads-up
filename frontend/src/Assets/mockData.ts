import { GameState, Iplayer } from '../Interfaces/interfaces';

export const mockGameStateWinner: GameState = {
  inHand: false,
  uid: '',
  displayName: '',
  opponentName: '',
  gid: 'a8911ab9e7',
  falseGID: false,
  gameHasEnoughPlayers: true,
  action: null,
  stage: 'winner',
  players: [
    {
      uid: 'ckn7un3m30056cloi5h7a4ast',
      name: 'ambika',
      chips: 0,
      ready: true,
      'bet-size': 0,
      hand: [
        [
          '10',
          'spades',
        ],
        [
          '9',
          'clubs',
        ],
      ],
      folded: false,
      'rounds-won': 0,
      profit: -1000,
    },
    {
      uid: 'ckn7un46e005bcloicr7i8vmb',
      name: 'ed',
      chips: 2000,
      ready: true,
      'bet-size': 0,
      hand: [
        [
          '5',
          'clubs',
        ],
        [
          'j',
          'spades',
        ],
      ],
      folded: false,
      'rounds-won': 0,
      profit: 1000,
    },
  ],
  whichPlayer: 0,
  oppHand: [
    [
      '5',
      'clubs',
    ],
    [
      'j',
      'spades',
    ],
  ],
  yourHand: [
    [
      '10',
      'spades',
    ],
    [
      '9',
      'clubs',
    ],
  ],
  community: [
    [
      '3',
      'hearts',
    ],
    [
      '6',
      'spades',
    ],
    [
      '5',
      'spades',
    ],
    [
      '6',
      'clubs',
    ],
    [
      'a',
      'clubs',
    ],
  ],
  winningHand: [
    'Two Pair',
    [
      5,
      5,
      6,
      6,
      14,
    ],
    [
      [
        '5',
        'clubs',
      ],
      [
        '6',
        'spades',
      ],
      [
        '5',
        'spades',
      ],
      [
        '6',
        'clubs',
      ],
      [
        'a',
        'clubs',
      ],
    ],
  ],
  winner: 'two',
  pot: 2000,
  noOfHands: 1,
  noOfRounds: 0,
  playerLeftMessage: '',
};

export const mockPlayerWinner: Iplayer = mockGameStateWinner.players[0];

export const mockPlayerBet: Iplayer = {
  uid: '123456',
  name: 'Edward',
  chips: 1000,
  ready: true,
  'bet-size': 500,
  hand: [['a', 'clubs'], ['k', 'clubs']],
  folded: false,
  'rounds-won': 3,
  profit: 0,
};

export const mockPlayerBetTwo: Iplayer = {
  uid: '0fdcd7e6-2621-4acd-8c9d-3c81f8e42382',
  name: 'TestWard Dot Com',
  chips: 10000000,
  ready: true,
  'bet-size': 9725,
  hand: [['2', 'clubs'], ['7', 'hearts']],
  folded: false,
  'rounds-won': 15,
  profit: 0,
};
