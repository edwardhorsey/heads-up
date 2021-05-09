import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import Announcement from './Announcement';

describe('Announcement tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<Announcement text="Test announcement" />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
