import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import GameHand from './GameHand';
import { mockGameStateWinner } from '../../Assets/mockData';

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
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
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
