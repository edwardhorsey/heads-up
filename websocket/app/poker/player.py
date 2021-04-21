from decimal import Decimal


class Player:
    def __init__(self, uid, name, chips, bet_size=0, folded=False):
        self.uid = uid
        self.name = name
        self.chips = Decimal(str(chips))
        self.bet_size = Decimal(str(bet_size))
        self.folded = folded

    def bet(self, amount):
        self.chips -= amount

    def self_dict(self):
        return {
            "uid": self.uid,
            "name": self.name,
            "chips": self.chips,
            "bet_size": self.bet_size,
            "folded": self.folded,
        }
