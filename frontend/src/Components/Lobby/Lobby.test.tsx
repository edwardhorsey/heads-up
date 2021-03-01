import React from 'react';
import { shallow } from 'enzyme';
import Lobby from '../Lobby/Lobby';


describe("Lobby tests", () => {
  let component: any;
  let mockFn;
  
  beforeEach(() => {
    mockFn = jest.fn();
      component = shallow(<Lobby />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})