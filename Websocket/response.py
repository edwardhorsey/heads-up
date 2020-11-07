from decimal import Decimal
from collections.abc import Mapping

from App.Poker.game import Game
from App.Poker.hand import Hand
from App.Poker.player import Player

eg={
  "game": {
    "current_blind": 100,
    "current_dealer": "two",
    "current_hand": {
                        "big_blind": 100,
                        "community": [
                            [
                            "a",
                            "clubs"
                            ],
                            [
                            "4",
                            "spades"
                            ],
                            [
                            "10",
                            "clubs"
                            ],
                            [
                            "6",
                            "spades"
                            ],
                            [
                            "3",
                            "spades"
                            ]
                        ],
                        "dealer": "two",
                        "deck": [
                            [
                            "2",
                            "diamonds"
                            ],
                            [
                            "2",
                            "clubs"
                            ],
                            [
                            "7",
                            "hearts"
                            ],
                            [
                            "a",
                            "diamonds"
                            ],
                            [
                            "k",
                            "spades"
                            ],
                            [
                            "5",
                            "clubs"
                            ],
                            [
                            "2",
                            "hearts"
                            ],
                            [
                            "k",
                            "clubs"
                            ],
                            [
                            "6",
                            "clubs"
                            ],
                            [
                            "k",
                            "diamonds"
                            ],
                            [
                            "3",
                            "hearts"
                            ],
                            [
                            "4",
                            "diamonds"
                            ],
                            [
                            "j",
                            "spades"
                            ],
                            [
                            "7",
                            "spades"
                            ],
                            [
                            "7",
                            "clubs"
                            ],
                            [
                            "10",
                            "spades"
                            ],
                            [
                            "q",
                            "clubs"
                            ],
                            [
                            "k",
                            "hearts"
                            ],
                            [
                            "4",
                            "hearts"
                            ],
                            [
                            "j",
                            "hearts"
                            ],
                            [
                            "3",
                            "diamonds"
                            ],
                            [
                            "5",
                            "hearts"
                            ],
                            [
                            "a",
                            "spades"
                            ],
                            [
                            "q",
                            "diamonds"
                            ],
                            [
                            "8",
                            "hearts"
                            ],
                            [
                            "8",
                            "clubs"
                            ],
                            [
                            "6",
                            "diamonds"
                            ],
                            [
                            "9",
                            "spades"
                            ],
                            [
                            "4",
                            "clubs"
                            ],
                            [
                            "10",
                            "hearts"
                            ],
                            [
                            "8",
                            "spades"
                            ],
                            [
                            "8",
                            "diamonds"
                            ],
                            [
                            "7",
                            "diamonds"
                            ],
                            [
                            "6",
                            "hearts"
                            ],
                            [
                            "q",
                            "hearts"
                            ],
                            [
                            "9",
                            "diamonds"
                            ],
                            [
                            "3",
                            "clubs"
                            ],
                            [
                            "j",
                            "diamonds"
                            ],
                            [
                            "j",
                            "clubs"
                            ],
                            [
                            "q",
                            "spades"
                            ],
                            [
                            "9",
                            "clubs"
                            ],
                            [
                            "9",
                            "hearts"
                            ],
                            [
                            "5",
                            "spades"
                            ]
                        ],
                        "one_cards": [
                            [
                            "a",
                            "hearts"
                            ],
                            [
                            "2",
                            "spades"
                            ]
                        ],
                        "one_hand_profit": -1000,
                        "one_starting_chips": 1000,
                        "pot": 2000,
                        "two_cards": [
                            [
                            "10",
                            "diamonds"
                            ],
                            [
                            "5",
                            "diamonds"
                            ]
                        ],
                        "two_hand_profit": 1000,
                        "two_starting_chips": 1000,
                        "winner": "two",
                        "winning_hand": [
                            "One Pair",
                            [
                            5,
                            6,
                            10,
                            10,
                            14
                            ],
                            [
                            [
                                "10",
                                "diamonds"
                            ],
                            [
                                "5",
                                "diamonds"
                            ],
                            [
                                "a",
                                "clubs"
                            ],
                            [
                                "10",
                                "clubs"
                            ],
                            [
                                "6",
                                "spades"
                            ]
                            ]
                        ]
    },
    "gid": 374,
    "number_of_hands": 1,
    "number_of_rounds": 0,
    "one_rounds_won": 0,
    "player_one": {
      "bankroll": 0,
      "bet_size": 0,
      "folded": False,
      "name": "hhh",
      "uid": "6f178a0c-dd0b-4f3d-a023-ff1fb397fdac"
    },
    "player_one_ready": True,
    "player_two": {
      "bankroll": 2000,
      "bet_size": 0,
      "folded": False,
      "name": "ghgg",
      "uid": "96ad37d9-781f-4082-9d94-cc98594a6565"
    },
    "player_two_ready": True,
    "previous_hands": [],
    "two_rounds_won": 0
  },
  "gameId": 374
}

cg = eg['game']

alterred_dict = {**cg}

if isinstance(cg['player_one'], Mapping):
    alterred_dict['player_one'] = Player(**cg['player_one'])

if isinstance(cg['player_two'], Mapping):
    alterred_dict['player_two'] = Player(**cg['player_two'])

if isinstance(cg['current_hand'], Mapping):
    alterred_dict['current_hand'] = Hand(**cg['current_hand'])

game_class = Game(**alterred_dict)
print(game_class.self_dict())
