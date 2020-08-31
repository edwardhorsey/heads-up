from random import shuffle
from itertools import product

class Deck():
    def __init__(self):
      self.suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades']
      self.cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']
      self.deck = self.create_deck()

    def create_deck(self):
      return list(product(self.cards, self.suits))

    def shuffle(self):
        return shuffle(self.deck)

    def deal_card(self):
        return self.deck.pop()