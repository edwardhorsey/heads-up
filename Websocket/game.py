from deck import Deck
from hand import Hand
from random import randrange

class Game():
    def __init__(self, gid, player_one):
        self.gid = gid
        self.player_one = player_one
        self.player_two = None
        self.player_one_ready = False
        self.player_two_ready = False
        self.current_dealer = self.random_dealer()
        self.current_hand = None
        self.current_blind = 10
        self.previous_hands = []
        self.number_of_hands = 0

    def random_dealer(self):
        return 'one' if randrange(2) == 1 else 'two'

    def add_player(self, player_two):
        self.player_two = player_two

    def new_hand(self):
        if self.player_one_ready and self.player_two_ready:
            self.player_one.folded = False
            self.player_two.folded = False
            self.number_of_hands += 1
            if self.number_of_hands > 1:
                self.current_dealer = 'two' if self.current_dealer == 'one' else 'two'
            self.current_hand = Hand(Deck(), self.current_blind, self.current_dealer, self.player_one.bankroll, self.player_two.bankroll)
            self.current_hand.deal_blinds(self.player_one, self.player_two, self.current_dealer)
            self.current_hand.deal_cards()