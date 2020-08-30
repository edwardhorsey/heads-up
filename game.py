from deck import Deck
from hand import Hand

class Game():
    def __init__(self, gid, player_one):
        self.gid = gid
        self.player_one = player_one
        self.player_two = None
        self.current_hand = None
        self.previous_hands = []

    def add_player(self, player_two):
        self.player_two = player_two

    def new_hand(self):
        self.current_hand = Hand(Deck())
        self.current_hand.preflop()