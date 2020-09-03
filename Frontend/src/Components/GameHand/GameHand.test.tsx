import React from 'react';
import { shallow } from 'enzyme';
import GameHand from './GameHand';

describe("Leaderboard tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<GameHand />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})