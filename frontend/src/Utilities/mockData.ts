import { Card, GameState } from '../Interfaces/interfaces';

const mockGameStateWinner: GameState = {
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
      bankroll: 0,
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
      bankroll: 2000,
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
};

export default mockGameStateWinner;
