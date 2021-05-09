import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import App from './App';

describe('App tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<App />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
