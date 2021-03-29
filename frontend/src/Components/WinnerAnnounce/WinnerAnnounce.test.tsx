import React from 'react';
import { shallow } from 'enzyme';
import WinnerAnnounce from './WinnerAnnounce';

describe('WinnerAnnounce tests', () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<WinnerAnnounce text="TDD is the winner" />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
