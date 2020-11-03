from decimal import Decimal

class Player():
    def __init__(self, uid, name, bankroll, bet_size = 0, folded = False):
        self.uid = uid
        self.name = name
        self.bankroll = bankroll
        self.bet_size = bet_size
        self.folded = folded
    
    def bet(self, amount):
        self.bankroll -= amount

    def self_dict(self):
        return {
            'uid': self.uid,
            'name': self.name,
            'bankroll': Decimal(str(self.bankroll)),
            'bet_size': Decimal(str(self.bet_size)),
            'folded': self.folded
        }