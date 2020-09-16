from .handevaluater import Hand_Evaluater

class Hand():
    def __init__(self, deck, big_blind, dealer, one_starting, two_starting):
        self.deck = deck
        deck.shuffle()
        self.big_blind = big_blind
        self.one_starting_chips = one_starting
        self.one_hand_profit = 0
        self.two_starting_chips = two_starting
        self.two_hand_profit = 0
        self.dealer = dealer
        self.one_cards = []
        self.two_cards = []
        self.community = []
        self.pot = 0
        self.winner = ''
        self.winning_hand = ('', [], [])

    def deal_cards(self):
        self.one_cards = [self.deck.deal_card(), self.deck.deal_card()]
        self.two_cards = [self.deck.deal_card(), self.deck.deal_card()]

    def bet(self, player, bet_amount):
        player.bet(bet_amount)
        self.pot += bet_amount

    def all_in(self, player):
        player.bet_size += player.bankroll
        self.bet(player, player.bankroll)

    def call(self, player, call_amount):
        player.bet(call_amount)
        player.bet_size = call_amount
        self.pot += call_amount
        self.run_cards()
        self.calculate_winner()
        
    def transfer_winnings(self, one, two):
        if self.winner == 'one':
            one.bankroll += self.pot
        elif self.winner == 'two':
            two.bankroll += self.pot
        elif self.winner == 'draw':
            one.bankroll += 0.5 * self.pot
            two.bankroll += 0.5 * self.pot
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
        for x in range(0, 5):
            self.community.append(self.deck.deal_card())

    def deal_blinds(self, p_one, p_two, dealer):
        multiplier = [1, 0.5] if dealer == 'one' else [0.5, 1]
        self.bet(p_one, multiplier[0]*self.big_blind)
        self.bet(p_two, multiplier[1]*self.big_blind)

    def calculate_winner(self):
        best_one = Hand_Evaluater(self.one_cards, self.community).find_best_hand()
        best_two = Hand_Evaluater(self.two_cards, self.community).find_best_hand()
        self.winner = Hand_Evaluater.compare_two_hands(best_one, best_two)
        if self.winner == 'one':
            self.winning_hand = (best_one)
        elif self.winner == 'two':
            self.winning_hand = (best_two)
        elif self.winner == 'draw':
            self.winning_hand = (best_one, best_two)
