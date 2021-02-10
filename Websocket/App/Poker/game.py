from .deck import Deck
from .hand import Hand
from App.Poker.player import Player

from App.tables import previous_hands_table

from decimal import Decimal
from collections.abc import Mapping
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

    def put_previous_hand(self):
        print('putting prev hand online')
        hand_dict = self.current_hand.self_dict()
        result = previous_hands_table.update_item(
            Key={ 'gameId': self.gid },
            UpdateExpression="SET previous_hands = list_append(if_not_exists(previous_hands, :empty_list), :i)",
            ExpressionAttributeValues={
                ':i': [hand_dict],
                ':empty_list': []
            },
            ReturnValues="UPDATED_NEW"
        )
        print('result' , result)

    def new_hand(self):
        print('new hand')
        if self.player_one_ready and self.player_two_ready:
            self.player_one.folded = False
            self.player_two.folded = False
            self.number_of_hands += 1
            if self.number_of_hands > 1:
                self.current_dealer = 'two' if self.current_dealer == 'one' else 'one'
            new_deck = Deck().create_shuffled_deck()
            self.current_hand = Hand(new_deck, self.current_blind, self.current_dealer, self.player_one.bankroll, self.player_two.bankroll)
            self.current_hand.deal_blinds(self.player_one, self.player_two, self.current_dealer)
            self.current_hand.deal_cards()

    def reset_players_bet_sizes(self):
        self.player_one.bet_size = Decimal(str(0))
        self.player_two.bet_size = Decimal(str(0))

    def print_player_response(self):
        return [{
          'uid': self.player_one.uid, 
          'name': self.player_one.name,
          'bankroll': self.player_one.bankroll,
          'ready': self.player_one_ready,
          'bet-size': self.player_one.bet_size,
          'hand': self.current_hand.one_cards if self.current_hand else [],
          'folded': self.player_one.folded,
          'rounds-won': self.one_rounds_won,
          'profit': self.current_hand.one_hand_profit if self.current_hand else None,
        }, {
          'uid': self.player_two.uid,
          'name': self.player_two.name,
          'bankroll': self.player_two.bankroll,
          'ready': self.player_two_ready,
          'bet-size': self.player_two.bet_size,
          'hand': self.current_hand.two_cards if self.current_hand else [],
          'folded': self.player_two.folded,
          'rounds-won': self.two_rounds_won,
          'profit': self.current_hand.two_hand_profit if self.current_hand else None,
        }]

    def self_dict(self):
        return {
            'gid': self.gid,
            'player_one': self.player_one.self_dict(),
            'player_two': self.player_two.self_dict() if self.player_two else False,
            'player_one_ready': self.player_one_ready,
            'player_two_ready': self.player_two_ready,
            'current_dealer': self.current_dealer,
            'current_hand': self.current_hand.self_dict() if self.current_hand else False,
            'current_blind': self.current_blind,
            'previous_hands': self.previous_hands,
            'number_of_hands': self.number_of_hands,
            'number_of_rounds': self.number_of_rounds,
            'one_rounds_won': self.one_rounds_won,
            'two_rounds_won': self.two_rounds_won
        }

    @staticmethod
    def re_map(game):
        alterred_dict = {**game}
        if isinstance(game['player_one'], Mapping):
            alterred_dict['player_one'] = Player(**game['player_one'])
        if isinstance(game['player_two'], Mapping):
            alterred_dict['player_two'] = Player(**game['player_two'])
        if isinstance(game['current_hand'], Mapping):
            alterred_dict['current_hand'] = Hand(**game['current_hand'])
        return Game(**alterred_dict)