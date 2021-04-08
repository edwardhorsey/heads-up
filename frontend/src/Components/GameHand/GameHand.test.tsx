import React from 'react';
import { shallow } from 'enzyme';
import GameHand from './GameHand';
import mockGameStateWinner from '../../Utilities/mockData';

const {
  action,
  community,
  noOfHands,
  oppHand,
  players,
  pot,
  stage,
  whichPlayer,
  winner,
  winningHand,
  yourHand,
} = mockGameStateWinner;

const [opponent, yourself] = players;

describe('GameHand tests', () => {
  let component: any;
  let mockFn;

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
        stage={stage}
        winner={winner}
        winningHand={winningHand}
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
