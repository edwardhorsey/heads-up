from os import sys, path
sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

import unittest

from Poker.hand_evaluater import Hand_Evaluater

class HandEvaluaterTest(unittest.TestCase):
    def stores_hand_and_community_cards(self):
        community = [['a', 'hearts'], ['k', 'hearts'], ['k', 'clubs'], ['10', 'hearts'], ['3', 'spades']]
        hand = [['q', 'hearts'], ['j', 'hearts']]
        test_eval = Hand_Evaluater(hand, community)
        expected = [*hand, *community]
        self.assertEqual(test_eval.seven_cards, expected)

if __name__ == '__main__':
    unittest.main()