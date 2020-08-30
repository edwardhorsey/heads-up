class Hand():
    def __init__(self, deck):
        self.deck = deck
        deck.shuffle()
        self.one = []
        self.two = []
        self.community = []
        self.pot = 0

    def preflop(self):
        self.one.append(self.deck.deal_card())
        self.two.append(self.deck.deal_card())
        self.one.append(self.deck.deal_card())
        self.two.append(self.deck.deal_card())

    def flop(self, pot):
        self.pot += pot
        self.community.append(self.deck.deal_card())
        self.community.append(self.deck.deal_card())
        self.community.append(self.deck.deal_card())

    def turn(self, pot):
        self.pot += pot
        self.community.append(self.deck.deal_card())

    def river(self, pot):
        self.pot += pot
        self.community.append(self.deck.deal_card())