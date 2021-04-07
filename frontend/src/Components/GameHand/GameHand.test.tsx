import React from 'react';
import { shallow } from 'enzyme';
import GameHand from './GameHand';
import { mockGameStateWinner } from '../../Utilities/mockData';

describe('GameHand tests', () => {
  let component: any;
  let mockFn;

  const [yourself, opponent] = mockGameStateWinner.players;

  const {
    action,
    community,
    noOfHands,
    oppHand,
    pot,
    winner,
    whichPlayer,
    yourHand,
  } = mockGameStateWinner;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(
      <GameHand
        action={action}
        community={community}
        noOfHands={noOfHands}
        opponent={opponent}
        oppHand={oppHand}
        pot={pot}
        stage="winner"
        winner={winner}
        winningHand={[
          'Two Pair',
          [5, 5, 6, 6, 14],
          [
            ['5', 'clubs'],
            ['6', 'spades'],
            ['5', 'spades'],
            ['6', 'clubs'],
            ['a', 'clubs']],
        ]}
        whichPlayer={whichPlayer}
        yourself={yourself}
        yourHand={yourHand}
      />,
    );
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
