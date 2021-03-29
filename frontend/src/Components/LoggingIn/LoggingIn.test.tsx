import React from 'react';
import { shallow } from 'enzyme';
import LoggingIn from './LoggingIn';

describe('LoggingIn tests', () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<LoggingIn />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
