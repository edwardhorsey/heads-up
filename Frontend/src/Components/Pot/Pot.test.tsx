import React from 'react';
import { shallow } from 'enzyme';
import Pot from './Pot';

describe("Pot tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<Pot amount={1350} />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})