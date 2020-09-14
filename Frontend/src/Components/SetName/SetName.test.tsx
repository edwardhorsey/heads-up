import React from 'react';
import { shallow } from 'enzyme';
import SetName from './SetName';

describe("SetName tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<SetName setName={mockFn} />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})