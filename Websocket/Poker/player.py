import json

class Player():
    def __init__(self, uid, name, bankroll):
        self.uid = uid
        self.name = name
        self.bankroll = bankroll
        self.bet_size = 0
        self.folded = False
    
    def bet(self, amount):
        self.bankroll -= amount
        self.bet_size = amount
