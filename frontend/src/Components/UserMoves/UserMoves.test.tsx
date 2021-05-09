import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import UserMoves from './UserMoves';

describe('UserMoves tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<UserMoves />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
