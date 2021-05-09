import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import PlayersChips from './PlayersChips';
import { mockPlayerBetTwo } from '../../Assets/mockData';

describe('PlayersChips tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(
      <PlayersChips
        which="Your"
        player={mockPlayerBetTwo}
        stage="to-call"
      />,
    );
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
