import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import Login from './Login';

describe('Login tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<Login />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
