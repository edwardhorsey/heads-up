import React from 'react';
import { shallow } from 'enzyme';
import GameNav from './GameNav';
import { Iplayer } from '../../Context/serverContext';

describe('GameNav tests', () => {
  let component: any;
  let mockFn;
  const testProp: Iplayer = {
    name: 'name',
    bankroll: 100,
    ready: true,
    blind: 2,
    uid: '12345',
    'bet-size': 0,
    hand: [],
    folded: false,
    'rounds-won': 5,
    profit: 0,
  };

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<GameNav yourself={testProp} opponent={testProp} />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
