import json

class Player():
    def __init__(self, uid, name, bankroll):
        self.uid = uid
        self.name = name
        self.bankroll = bankroll
    
    def bet(self, amount):
        self.bankroll -= amount