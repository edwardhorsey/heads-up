import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import ChipsGen from './ChipsGen';

describe('ChipsGen tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<ChipsGen amount={724} />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
