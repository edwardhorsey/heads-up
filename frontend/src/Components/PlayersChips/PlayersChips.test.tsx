import React from 'react';
import { shallow } from 'enzyme';
import PlayersChips from './PlayersChips';
import { Iplayer } from '../../Context/serverContext';

describe('PlayersChips tests', () => {
  let component: any;
  let mockFn;

  const testPlayer: Iplayer = {
    uid: '0fdcd7e6-2621-4acd-8c9d-3c81f8e42382',
    name: 'TestWard Dot Com',
    bankroll: 10000000,
    ready: true,
    'bet-size': 9725,
    hand: [['2', 'clubs'], ['7', 'hearts']],
    folded: false,
    blind: 100,
    'rounds-won': 15,
    profit: 0,
  };

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<PlayersChips which="Your" player={testPlayer} stage="to-call" />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
