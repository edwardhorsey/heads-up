import React from 'react';
import { shallow } from 'enzyme';
import Login from './Login';

describe('Login tests', () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<Login />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
