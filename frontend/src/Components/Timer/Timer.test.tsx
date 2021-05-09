import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import Timer from './Timer';

describe('Leaderboard tests', () => {
  let component: ShallowWrapper<React.FC>;
  let mockFn = () => { console.log('Timer.test'); };

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<Timer logic={mockFn} num={808} />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
