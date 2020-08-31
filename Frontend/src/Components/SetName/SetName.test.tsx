import React from 'react';
import { shallow } from 'enzyme';
import SetName from './SetName';

describe("Leaderboard tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<SetName />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})