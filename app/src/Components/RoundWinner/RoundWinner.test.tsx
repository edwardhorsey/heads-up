import React from 'react';
import { shallow } from 'enzyme';
import RoundWinner from './RoundWinner';

describe("RoundWinner tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<RoundWinner text={'TS defeats JS, this round'} />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})