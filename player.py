class Player():
    def __init__(self, uid, name, bankroll):
        self.uid = uid
        self.name = name
        self.bank = bankroll
    
    def bet(self, amount):
        self.bank -= amount