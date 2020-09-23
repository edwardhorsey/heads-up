import unittest

from App.app import all_in, call
from App.Poker.game import Game
from App.Poker.player import Player

def create_game_environment(one_bank=1000, two_bank=1000):
    player_one = Player(1234, 'Bob', one_bank)
    player_two = Player(2345, 'Lucy', two_bank)
    game = Game(808, player_one)
    game.add_player(player_two)
    game.current_dealer = 'two'
    game.player_one_ready = True
    game.player_two_ready = True
    return game

class all_in_call_test(unittest.TestCase):

    def test_allin_small_blind(self):
        game = create_game_environment()
        game.new_hand()
        game.current_hand.all_in(game.player_one)
        self.assertEqual(game.player_one.bet_size, 1000)
        self.assertEqual(game.player_one.bankroll, 0)
        self.assertEqual(game.player_two.bet_size, 100)
        self.assertEqual(game.player_two.bankroll, 900)
        self.assertEqual(game.current_hand.pot, 1100)

    def test_allin_big_blind(self):
        game = create_game_environment(650, 1300)
        game.new_hand()
        game.current_hand.all_in(game.player_two)
        self.assertEqual(game.player_one.bet_size, 50)
        self.assertEqual(game.player_one.bankroll, 600)
        self.assertEqual(game.player_two.bet_size, 1300)
        self.assertEqual(game.player_two.bankroll, 0)
        self.assertEqual(game.current_hand.pot, 1350)

    def test_even_stacks_allin_call(self):
        game = create_game_environment()

        game.new_hand()
        game.current_hand.all_in(game.player_one)
        game.current_hand.call(game.player_two, 1000, game.player_one)
        self.assertEqual(game.player_one.bet_size, 1000)
        self.assertEqual(game.player_one.bankroll, 0)
        self.assertEqual(game.player_two.bet_size, 1000)
        self.assertEqual(game.player_two.bankroll, 0)
        self.assertEqual(game.current_hand.pot, 2000)

    def test_even_uneven_stacks_allin_call(self):
        game = create_game_environment(1800, 750)
        game.new_hand()
        game.current_hand.all_in(game.player_one)
        self.assertEqual(game.player_one.bet_size, 1800)
        game.current_hand.call(game.player_two, 1800, game.player_one)
        self.assertEqual(game.player_one.bet_size, 750)
        self.assertEqual(game.player_one.bankroll, 1050)
        self.assertEqual(game.player_two.bet_size, 750)
        self.assertEqual(game.player_two.bankroll, 0)
        self.assertEqual(game.current_hand.pot, 1500)

    def test_even_uneven_stacks_alt_allin_call(self):
        game = create_game_environment(450, 1550)
        game.new_hand()
        game.current_hand.all_in(game.player_one)
        self.assertEqual(game.player_one.bet_size, 450)
        game.current_hand.call(game.player_two, 450, game.player_one)
        self.assertEqual(game.player_one.bet_size, 450)
        self.assertEqual(game.player_one.bankroll, 0)
        self.assertEqual(game.player_two.bet_size, 450)
        self.assertEqual(game.player_two.bankroll, 1100)
        self.assertEqual(game.current_hand.pot, 900)


if __name__ == '__main__':
    unittest.main()