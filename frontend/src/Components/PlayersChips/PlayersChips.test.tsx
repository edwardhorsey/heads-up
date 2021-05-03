import React from 'react';
import { shallow } from 'enzyme';
import PlayersChips from './PlayersChips';
import { mockPlayerBetTwo } from '../../Assets/mockData';

describe('PlayersChips tests', () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
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
