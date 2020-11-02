from .deck import Deck
from .hand import Hand
from random import randrange

def random_dealer():
    return 'one' if randrange(2) == 1 else 'two'

class Game():
    def __init__(self, gid, player_one, player_two = None, player_one_ready = False, player_two_ready = False, current_dealer = random_dealer(), current_hand = None, current_blind = 100, previous_hands = [], number_of_hands = 0, number_of_rounds = 0, one_rounds_won = 0, two_rounds_won = 0):
        self.gid = gid
        self.player_one = player_one
        self.player_two = player_two
        self.player_one_ready = player_one_ready
        self.player_two_ready = player_two_ready
        self.current_dealer = current_dealer
        self.current_hand = current_hand
        self.current_blind = current_blind
        self.previous_hands = previous_hands
        self.number_of_hands = number_of_hands
        self.number_of_rounds = number_of_rounds
        self.one_rounds_won = one_rounds_won
        self.two_rounds_won = two_rounds_won

    def new_round(self):
        self.number_of_rounds += 1
        if self.player_one.bankroll <= 0:
            self.two_rounds_won += 1
        else:
            self.one_rounds_won += 1
        self.number_of_hands = 0
        self.player_one_ready = False
        self.player_two_ready = False

    def add_player(self, player_two):
        self.player_two = player_two

    def new_hand(self):
        if self.player_one_ready and self.player_two_ready:
            self.player_one.folded = False
            self.player_two.folded = False
            self.number_of_hands += 1
            if self.number_of_hands > 1:
                self.current_dealer = 'two' if self.current_dealer == 'one' else 'one'
            if self.current_hand:
                self.current_hand.deck=''
                self.previous_hands.append(self.current_hand)
            new_deck = Deck().create_shuffled_deck()
            self.current_hand = Hand(new_deck, self.current_blind, self.current_dealer, self.player_one.bankroll, self.player_two.bankroll)
            self.current_hand.deal_blinds(self.player_one, self.player_two, self.current_dealer)
            self.current_hand.deal_cards()

    def reset_players_bet_sizes(self):
        self.player_one.bet_size = 0
        self.player_two.bet_size = 0

    def print_player_response(self):
        return [{
          'uid': self.player_one.uid, 
          'name': self.player_one.name,
          'bankroll': self.player_one.bankroll,
          'ready': self.player_one_ready,
          'bet-size': self.player_one.bet_size,
          'hand': self.current_hand.one_cards,
          'folded': self.player_one.folded,
          'rounds-won': self.one_rounds_won,
          'profit': self.current_hand.one_hand_profit,
        }, {
          'uid': self.player_two.uid,
          'name': self.player_two.name,
          'bankroll': self.player_two.bankroll,
          'ready': self.player_two_ready,
          'bet-size': self.player_two.bet_size,
          'hand': self.current_hand.two_cards,
          'folded': self.player_two.folded,
          'rounds-won': self.two_rounds_won,
          'profit': self.current_hand.two_hand_profit,
        }]