import React from 'react';
import { shallow } from 'enzyme';
import GameNav from './GameNav';

describe("Leaderboard tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<GameNav />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})