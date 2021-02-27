import React from 'react';
import { shallow } from 'enzyme';
import Button from './Button';

describe("Leaderboard tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<Button logic={()=>{console.log('test')}} text={'testing'} />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})