import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import CreateOrJoin from './CreateOrJoin';

describe('CreateOrJoin tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<CreateOrJoin />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
