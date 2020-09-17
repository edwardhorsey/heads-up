from itertools import combinations

class Evaluate():
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
            return ('Full House', self.ranks, self.cards)

        if 5 in suits_hash_values:
            if self.test_straight(ranks_set):
                if ranks_set[-1] == 14:
                    return ('Royal Flush', self.ranks, self.cards)
                else:
                    return ('Straight Flush', self.ranks, self.cards)
            else:
                return ('Flush', self.ranks, self.cards)

        if 4 in ranks_hash_values:
            return ('Four Of A Kind', self.ranks, self.cards)

        if self.test_straight(ranks_set):
            return ('Straight', self.ranks, self.cards)

        if 3 in ranks_hash_values:
            return ('Trips', self.ranks, self.cards)

        if 2 in ranks_hash_values and len(ranks_hash_values) < 4:
            return ('Two Pair', self.ranks, self.cards)

        if 2 in ranks_hash_values:
            return ('One Pair', self.ranks, self.cards)

        return ('High Card', self.ranks, self.cards)

    def make_hash(self, list):
        obj = dict()
        for item in list:
            obj[item] = obj.get(item, 0) + 1
        return obj

class Hand_Evaluater():
    
    rankings = {
      'Royal Flush': 1,
      'Straight Flush': 2,
      'Four Of A Kind': 3,
      'Full House': 4,
      'Flush': 5,
      'Straight': 6,
      'Trips': 7,
      'Two Pair': 8,
      'One Pair': 9,
      'High Card': 10
    }

    def __init__(self, hand, community):
        self.hand = hand,
        self.community = community
        self.seven_cards = hand + community
        self.combinations = combinations(self.seven_cards, 5)

    def find_best_hand(self):
        best_hand = 10
        high_cards = [1,1,1,1,1]
        result = []
        for hand in self.combinations:
            hand = Evaluate(hand)
            assessed = hand.assess()
            if Hand_Evaluater.rankings[assessed[0]] < best_hand:
                best_hand = Hand_Evaluater.rankings[assessed[0]]
                high_cards = assessed[1]
                result = assessed
            elif Hand_Evaluater.rankings[assessed[0]] == best_hand:
                if assessed[1] > high_cards:
                    high_cards = assessed[1]
                    result = assessed
        return result

    @staticmethod
    def compare_two_hands(one, two):
        if Hand_Evaluater.rankings[one[0]] < Hand_Evaluater.rankings[two[0]]:
            return 'one'
        elif Hand_Evaluater.rankings[one[0]] > Hand_Evaluater.rankings[two[0]]:
            return 'two'
        elif Hand_Evaluater.rankings[one[0]] == Hand_Evaluater.rankings[two[0]]:
            if one[1] > two[1]:
                return 'one'
            elif two[1] > one[1]:
                return 'two'
            else:
                return 'draw'