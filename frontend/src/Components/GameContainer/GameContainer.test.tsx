import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import GameContainer from './GameContainer';

describe('GameContainer tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<GameContainer />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
