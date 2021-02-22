import React from 'react';
import { shallow } from 'enzyme';
import CreateOrJoin from './CreateOrJoin';

describe("CreateOrJoin tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<CreateOrJoin />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})