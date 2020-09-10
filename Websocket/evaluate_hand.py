from deck import Deck
from itertools import combinations

rankings = {
  'Royal Flush': 1,
  'Straight Flush': 2,
  'Four Of A Kind': 3,
  'Full House': 4,
  'Straight': 5,
  'Trips': 6,
  'Two Pair': 7,
  'One Pair': 8,
  'High Card': 9
}

class Evaluate_hand():
    def __init__(self, cards):
        self.rankvalues = dict((r,i) for i,r in enumerate(['.','.','2','3','4','5','6','7','8','9','10','j','q','k','a']))
        self.cards = cards
        self.suits = [s for r,s in self.cards]
        self.ranks = sorted([self.rankvalues[r] for r,i in self.cards])
        self.suits_hash = self.make_hash(self.suits)
        self.ranks_hash = self.make_hash(self.ranks)

    def test_straight(self, ranks_set):
        return True if len(ranks_set) == 5 and (ranks_set[-1] - ranks_set[0] == 4) else False

    def assess(self):
        ranks_hash_values = self.ranks_hash.values()
        suits_hash_values = self.suits_hash.values()
        ranks_set = list(set(self.ranks))

        if 3 in ranks_hash_values and 2 in ranks_hash_values:
            return ('Full House', self.cards)

        if 5 in suits_hash_values:
            if self.test_straight(ranks_set):
                if ranks_set[-1] == 14:
                    return ('Royal Flush', self.cards)
                else:
                    return ('Straight Flush', self.cards)
            else:
                return ('Flush', self.cards)

        if 4 in ranks_hash_values:
            return ('Four Of A Kind', self.cards)

        if self.test_straight(ranks_set):
            return ('Straight', self.cards)

        if 3 in ranks_hash_values:
            return ('Trips', self.cards)

        if 2 in ranks_hash_values and len(ranks_hash_values) < 4:
            return ('Two Pair', self.cards)

        if 2 in ranks_hash_values:
            return ('One Pair', self.cards)

        return (f'High Card', ranks_set[-1], self.cards)

    def make_hash(self, list):
        obj = dict()
        for item in list:
            obj[item] = obj.get(item, 0) + 1
        return obj

d = Deck()
d.shuffle()

one = [d.deal_card() for x in range(2)]
two = [d.deal_card() for x in range(2)]
comm = [d.deal_card() for x in range(5)]
print(one, two)

one_seven_cards = one + comm
two_seven_cards = two + comm

one_combinations = combinations(one_seven_cards, 5)

one_best = 9
result = []

for hand in one_combinations:
    bit = Evaluate_hand(hand)
    bit_assessed = bit.assess()
    print(bit_assessed[0])
    if rankings[bit_assessed[0]] < one_best:
        one_best = rankings[bit_assessed[0]]
        result = [bit_assessed]
    elif rankings[bit_assessed[0]] == one_best:
        result.append(bit_assessed)

if len(result) == 1:
    print(result[0])


# two_combinations = itertools.combinations(self.cards, 5)