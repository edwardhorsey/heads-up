import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import Lobby from './Lobby';

describe('Lobby tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<Lobby />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
