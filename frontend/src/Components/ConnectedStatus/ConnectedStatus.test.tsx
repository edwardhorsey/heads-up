import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import ConnectedStatus from './ConnectedStatus';

describe('ConnectedStatus tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<ConnectedStatus />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
