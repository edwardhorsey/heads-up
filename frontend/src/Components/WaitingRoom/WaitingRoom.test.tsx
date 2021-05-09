import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import WaitingRoom from './WaitingRoom';

describe('WaitingRoom tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<WaitingRoom />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
