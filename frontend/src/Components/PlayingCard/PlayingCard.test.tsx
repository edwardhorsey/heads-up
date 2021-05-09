import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import PlayingCard from './PlayingCard';

describe('PlayingCard tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(<PlayingCard winner card={['q', 'hearts']} />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
