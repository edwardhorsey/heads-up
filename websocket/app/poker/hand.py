from decimal import Decimal
from .hand_evaluater import Hand_Evaluater
from .deck import Deck

class Hand():
    def __init__(self,
    deck,
    big_blind,
    dealer,
    one_starting_chips,
    two_starting_chips,
    one_hand_profit = 0,
    two_hand_profit = 0,
    one_cards = [],
    two_cards = [],
    community = [],
    pot = 0,
    winner = '',
    winning_hand = ['', [], []]
    ):
        self.deck = deck
        self.big_blind = big_blind
        self.dealer = dealer
        self.one_starting_chips = Decimal(str(one_starting_chips))
        self.two_starting_chips = Decimal(str(two_starting_chips))
        self.one_hand_profit = Decimal(str(one_hand_profit))
        self.two_hand_profit = Decimal(str(two_hand_profit))
        self.one_cards = one_cards
        self.two_cards = two_cards
        self.community = community
        self.pot = Decimal(str(pot))
        self.winner = winner
        self.winning_hand = winning_hand

    def deal_cards(self):
        self.one_cards = [self.deck.pop(), self.deck.pop()]
        self.two_cards = [self.deck.pop(), self.deck.pop()]

    def bet(self, player, bet_amount):
        player.bet(bet_amount)
        self.pot += bet_amount

    def all_in(self, player):
        player.bet_size += player.bankroll
        self.bet(player, player.bankroll)

    def call(self, calling_player, total_bet, all_in_player):
        amount_left_to_call = total_bet - calling_player.bet_size
        if amount_left_to_call > calling_player.bankroll:
            difference = amount_left_to_call - calling_player.bankroll
            all_in_player.bankroll += difference
            all_in_player.bet_size -= difference
            self.pot -= difference
            amount_left_to_call = calling_player.bankroll
        self.bet(calling_player, amount_left_to_call)
        calling_player.bet_size += amount_left_to_call
        self.run_cards()
        self.calculate_winner()

        
    def transfer_winnings(self, one, two):
        if self.winner == 'one':
            one.bankroll += self.pot
        elif self.winner == 'two':
            two.bankroll += self.pot
        elif self.winner == 'draw':
            one.bankroll += Decimal(str(0.5)) * self.pot
            two.bankroll += Decimal(str(0.5)) * self.pot
        self.one_hand_profit = one.bankroll - self.one_starting_chips
        self.two_hand_profit = two.bankroll - self.two_starting_chips

    def fold(self, which, one, two):
        if which == 'one':
            one.folded = True
            self.winner = 'two'
        else:
            self.winner = 'one'
            two.folded = True

    def run_cards(self):
        if len(self.community) > 0:
            self.community = []
        for x in range(0, 5):
            self.community.append(self.deck.pop())

    def deal_blinds(self, p_one, p_two, dealer):
        multiplier = [Decimal(str(1)), Decimal(str(0.5))] if dealer == 'one' else [Decimal(str(0.5)), Decimal(str(1))]
        self.bet(p_one, multiplier[0]*self.big_blind)
        p_one.bet_size = multiplier[0]*self.big_blind
        self.bet(p_two, multiplier[1]*self.big_blind)
        p_two.bet_size = multiplier[1]*self.big_blind

    def calculate_winner(self):
        best_one = Hand_Evaluater(self.one_cards, self.community).find_best_hand()
        best_two = Hand_Evaluater(self.two_cards, self.community).find_best_hand()
        self.winner = Hand_Evaluater.compare_two_hands(best_one, best_two)
        if self.winner == 'one':
            self.winning_hand = (best_one)
        elif self.winner == 'two':
            self.winning_hand = (best_two)
        elif self.winner == 'draw':
            both = best_one[2] + best_two[2]
            winning_cards = [ list(y) for y in set(tuple(x) for x in both)]
            self.winning_hand = [best_one[0], best_one[1], winning_cards]

    def self_dict(self):
        return {
            'deck': self.deck,
            'big_blind': self.big_blind,
            'dealer': self.dealer,
            'one_starting_chips': self.one_starting_chips,
            'two_starting_chips': self.two_starting_chips,
            'one_hand_profit': self.one_hand_profit,
            'two_hand_profit': self.two_hand_profit,
            'one_cards': self.one_cards,
            'two_cards': self.two_cards,
            'community': self.community,
            'pot': self.pot,
            'winner': self.winner,
            'winning_hand': self.winning_hand
        }