from random import shuffle
from itertools import product

class Deck():
    def __init__(self):
      self.suits = ['hearts', 'clubs', 'diamonds', 'spades']
      self.cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a']
      self.deck = self.create_deck()

    def create_deck(self):
        return [[item[0], item[1]] for item in product(self.cards, self.suits)]

    def create_shuffled_deck(self):
        shuffle(self.deck)
        return self.deck