import React from 'react';
import { shallow } from 'enzyme';
import PlayerStats from './PlayerStats';
import { Iplayer } from '../../Context/interfaces';

describe("PlayerStats tests", () => {
  let component: any;
  let mockFn;
  let testProp: Iplayer = {
    uid: '123456',
    name: 'Edward',
    bankroll: 1000,
    ready: true,
    'bet-size': 500,
    hand: [['a','clubs'], ['k', 'clubs']],
    folded: false,
    blind: 100,
    'rounds-won': 3,
    profit: 0
  }
  const yourHand = [['a','clubs'], ['k', 'clubs']];

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<PlayerStats player={testProp} who="you" stage="preflop" yourHand={yourHand} />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})