import React from 'react';
import { shallow } from 'enzyme';
import WaitingRoom from './WaitingRoom';

describe('WaitingRoom tests', () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<WaitingRoom />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
