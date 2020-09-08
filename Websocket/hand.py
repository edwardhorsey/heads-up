class Hand():
    def __init__(self, deck, big_blind, dealer):
        self.deck = deck
        deck.shuffle()
        self.big_blind = big_blind
        self.one_blind = 0
        self.two_blind = 0
        self.dealer = dealer
        self.one_cards = []
        self.two_cards = []
        self.community = []
        self.pot = 0
        self.all_in_amount = False

    def deal_cards(self):
        self.one_cards.append(self.deck.deal_card())
        self.two_cards.append(self.deck.deal_card())
        self.one_cards.append(self.deck.deal_card())
        self.two_cards.append(self.deck.deal_card())

    def bet(self, player, bet_amount):
        player.bet(bet_amount)
        self.pot += bet_amount

    def all_in(self, player)
        self.bet(player, player.bankroll)
        self.all_in_amount = player.bankroll


    def declare_winner(self, player):
        player.bankroll += self.pot

    def run_cards(self):
        for x in range(0, 5):
            self.community.append(self.deck.deal_card())

    def deal_blinds(self, p_one, p_two, dealer):
        multiplier = [1, 0.5] if dealer == 'one' else [0.5, 1]
        self.p_one_blind = multiplier[0]*self.big_blind
        self.p_two_blind = multiplier[1]*self.big_blind
        self.bet(p_one, self.p_one_blind)
        self.bet(p_two, self.p_two_blind)
