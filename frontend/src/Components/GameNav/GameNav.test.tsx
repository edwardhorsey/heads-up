import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import GameNav from './GameNav';
import { mockGameStateWinner } from '../../Assets/mockData';

describe('GameNav tests', () => {
  let component: ShallowWrapper<React.FC>;

  const { stage, players } = mockGameStateWinner;

  beforeEach(() => {
    component = shallow(
      <GameNav
        yourself={players[0]}
        opponent={players[1]}
        stage={stage}
        yourHand={players[0].hand}
      />,
    );
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
