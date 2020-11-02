import json

class Player():
    def __init__(self, uid, name, bankroll, bet_size = 0, folded = False):
        self.uid = uid
        self.name = name
        self.bankroll = bankroll
        self.bet_size = bet_size
        self.folded = folded
    
    def bet(self, amount):
        self.bankroll -= amount