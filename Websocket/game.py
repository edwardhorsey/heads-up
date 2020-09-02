from deck import Deck
from hand import Hand

class Game():
    def __init__(self, gid, player_one):
        self.gid = gid
        self.player_one = player_one
        self.player_two = None
        self.player_one_ready = False
        self.player_two_ready = False
        self.current_hand = None
        self.previous_hands = []
        self.number_of_hands = 0

    def add_player(self, player_two):
        self.player_two = player_two

    def new_hand(self):
        if self.player_one_ready and self.player_two_ready:
            self.number_of_hands += 1
            self.current_hand = Hand(Deck())
            self.current_hand.preflop()