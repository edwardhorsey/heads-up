import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import Pot from './Pot';

describe('Pot tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<Pot amount={1350} stage="winner" />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
