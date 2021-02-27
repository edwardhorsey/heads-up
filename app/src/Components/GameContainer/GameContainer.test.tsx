import React from 'react';
import { shallow } from 'enzyme';
import GameContainer from '../GameContainer/GameContainer';

describe("GameContainer tests", () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<GameContainer />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})