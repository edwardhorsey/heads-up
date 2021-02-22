import React from 'react';
import { shallow } from 'enzyme';
import ChipsGen from './ChipsGen';

describe("ChipsGen tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<ChipsGen amount={724} />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})