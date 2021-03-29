import React from 'react';
import { shallow } from 'enzyme';
import PlayingCard from './PlayingCard';

describe('PlayingCard tests', () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<PlayingCard winner card={['q', 'hearts']} />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
