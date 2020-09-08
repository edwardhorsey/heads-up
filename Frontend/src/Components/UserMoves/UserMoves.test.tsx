import React from 'react';
import { shallow } from 'enzyme';
import UserMoves from './UserMoves';

describe("Leaderboard tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<UserMoves />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})