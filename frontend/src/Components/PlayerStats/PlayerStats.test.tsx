import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import PlayerStats from './PlayerStats';
import { mockPlayerBet } from '../../Assets/mockData';

describe('PlayerStats tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
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
