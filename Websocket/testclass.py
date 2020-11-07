# objtest = {
#     'c':42142,
#     'b':21523,
#     'd':2431123,
#     'a':124,
# }


# class TC():
#     def __init__(self, a,b,d,c='cunt'):
#         self.a = a
#         self.b = b
#         self.c = c
#         self.d = d

#     def crap(self):
#         return (self.a,self.b,self.c,self.d,)



# testing_class = TC(a=1, b=2, c=3, d=4)
# # testing_class = TC(**objtest)

# print(testing_class.crap())


crap = {
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
    }
}

from App.Poker.hand import Hand

h = Hand(**crap['current_hand'])

print(h) 

