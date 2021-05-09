import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import Button from './Button';

describe('Leaderboard tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(
      <Button
        logic={() => { console.log('Button test'); }}
        text="testing"
      />,
    );
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
