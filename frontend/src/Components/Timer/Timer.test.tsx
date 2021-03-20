import React from 'react';
import { shallow } from 'enzyme';
import Timer from './Timer';

describe("Leaderboard tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<Timer logic={()=>{console.log('Timer.test')}} num={808} />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})