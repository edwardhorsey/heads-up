import React from 'react';
import { shallow } from 'enzyme';
import ConnectedStatus from './ConnectedStatus';

describe("ConnectedStatus tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<ConnectedStatus />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})