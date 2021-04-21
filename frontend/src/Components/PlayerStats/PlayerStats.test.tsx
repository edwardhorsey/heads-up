import React from 'react';
import { shallow } from 'enzyme';
import PlayerStats from './PlayerStats';
import { mockPlayerBet } from '../../Assets/mockData';

describe('PlayerStats tests', () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(
      <PlayerStats
        player={mockPlayerBet}
        who="you"
        stage="preflop"
        yourHand={mockPlayerBet.hand}
      />,
    );
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
