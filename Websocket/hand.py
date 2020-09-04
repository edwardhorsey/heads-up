class Hand():
    def __init__(self, deck, big_blind, dealer):
        self.deck = deck
        deck.shuffle()
        self.big_blind = big_blind
        self.one_blind = 0
        self.two_blind = 0
        self.one_cards = []
        self.two_cards = []
        self.community = []
        self.pot = 0

    def deal_cards(self):
        self.one_cards.append(self.deck.deal_card())
        self.two_cards.append(self.deck.deal_card())
        self.one_cards.append(self.deck.deal_card())
        self.two_cards.append(self.deck.deal_card())

    def deal_blinds(self, p_one, p_two, dealer):
        multiplier = [1, 0.5] if dealer == 'one' else [0.5, 1]
        p_one.bet(multiplier[0]*self.big_blind)
        self.p_one_blind = multiplier[0]*self.big_blind
        p_two.bet(multiplier[1]*self.big_blind)
        self.p_two_blind = multiplier[0]*self.big_blind
        self.pot += 1.5*self.big_blind

    def all_in(self, player):
        bet_amount = player.bankroll
        player.bet(bet_amount)
        self.pot += bet_amount