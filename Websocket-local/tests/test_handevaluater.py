import unittest

from App.Poker.hand_evaluater import Hand_Evaluater, Evaluate

class HandEvaluaterTest(unittest.TestCase):
    def test_stores_hand_and_community_cards(self):
        community = [['a', 'hearts'], ['k', 'hearts'], ['k', 'clubs'], ['10', 'hearts'], ['3', 'spades']]
        hand = [['q', 'hearts'], ['j', 'hearts']]
        test_eval = Hand_Evaluater(hand, community)
        expected = [*hand, *community]
        self.assertEqual(test_eval.seven_cards, expected)

    def test_analyse_hands(self):
        hand_one = [['k', 'hearts'], ['q', 'hearts'], ['j', 'hearts'], ['a', 'hearts'], ['10', 'hearts']]
        hand_two = [['2', 'clubs'], ['6', 'clubs'],  ['k', 'clubs'], ['k', 'hearts'], ['a', 'hearts']]
        hand_three = [['5', 'clubs'], ['6', 'hearts'], ['7', 'spades'], ['8', 'spades'], ['9', 'spades']]
        one_assessed = Evaluate(hand_one).assess()
        one_expected = ['Royal Flush', [10,11,12,13,14], hand_one]
        two_assessed = Evaluate(hand_two).assess()
        two_expected = ['One Pair', [2, 6, 13, 13, 14], hand_two]
        three_assessed = Evaluate(hand_three).assess()
        three_expected = ['Straight', [5,6,7,8,9], hand_three]
        self.assertEqual(one_assessed, one_expected)
        self.assertEqual(two_assessed, two_expected)
        self.assertEqual(three_assessed, three_expected)

    def test_easy_win(self):
        hand_one = [['k', 'hearts'], ['q', 'hearts'], ['j', 'hearts'], ['a', 'hearts'], ['10', 'hearts']]
        hand_two = [['2', 'clubs'], ['6', 'clubs'],  ['k', 'clubs'], ['k', 'hearts'], ['a', 'hearts']]
        expected = 'one'
        self.assertEqual(Hand_Evaluater.compare_two_hands(Evaluate(hand_one).assess(), Evaluate(hand_two).assess()), expected)

    def test_close_win(self):
        hand_one = [['k', 'hearts'], ['q', 'hearts'], ['j', 'hearts'], ['a', 'hearts'], ['10', 'hearts']]
        hand_two = [['2', 'clubs'], ['6', 'clubs'],  ['k', 'clubs'], ['k', 'hearts'], ['a', 'hearts']]
        expected = 'one'
        self.assertEqual(Hand_Evaluater.compare_two_hands(Evaluate(hand_one).assess(), Evaluate(hand_two).assess()), expected)

    def test_draw(self):
        community = [['5', 'clubs'], ['6', 'hearts'], ['7', 'spades'], ['8', 'spades'], ['9', 'spades']]
        hand_one = [['k', 'spades'], ['k','clubs']]
        hand_two = [['a', 'diamonds'], ['a', 'clubs']]
        best_one = Hand_Evaluater(hand_one, community).find_best_hand()
        best_two = Hand_Evaluater(hand_two, community).find_best_hand()
        expected = 'draw'
        self.assertEqual(Hand_Evaluater.compare_two_hands(best_one, best_two), expected)

    def test_high_card_wins(self):
        community = [['5', 'clubs'], ['6', 'hearts'], ['a', 'spades'], ['a', 'clubs'], ['9', 'spades']]
        hand_one = [['6', 'spades'], ['k','clubs']]
        hand_two = [['q', 'diamonds'], ['6', 'clubs']]
        best_one = Hand_Evaluater(hand_one, community).find_best_hand()
        best_two = Hand_Evaluater(hand_two, community).find_best_hand()
        expected = 'one'
        self.assertEqual(Hand_Evaluater.compare_two_hands(best_one, best_two), expected)

if __name__ == '__main__':
    unittest.main()