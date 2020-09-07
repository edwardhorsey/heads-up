import React from 'react';
import { shallow } from 'enzyme';
import PlayingCard from './PlayingCard';

describe("Leaderboard tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<PlayingCard card={['q', 'hearts']} />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})