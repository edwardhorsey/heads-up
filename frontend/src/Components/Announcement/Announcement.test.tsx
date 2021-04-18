import React from 'react';
import { shallow } from 'enzyme';
import Announcement from './Announcement';

describe('Announcement tests', () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<Announcement text="TDD is the winner" />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
