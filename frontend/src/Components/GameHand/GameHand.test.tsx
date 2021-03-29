import React from 'react';
import { shallow } from 'enzyme';
import GameHand from './GameHand';

describe('GameHand tests', () => {
  let component: any;
  let mockFn;

  const player = {
    name: 'string',
    bankroll: 1000,
    ready: true,
    'bet-size': 50,
    folded: false,
  };

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<GameHand yourself={player} opponent={player} />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
