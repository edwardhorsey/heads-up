import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import LoggingIn from './LoggingIn';

describe('LoggingIn tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<LoggingIn />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
