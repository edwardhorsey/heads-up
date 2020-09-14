import React from 'react';
import { shallow } from 'enzyme';
import GameNav from './GameNav';

describe("GameNav tests", () => {
  let component: any;
  let mockFn;
  let testProp = {
    name: 'name',
    bankroll: 100,
    ready: true,
    blind: 2
  }

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<GameNav yourself={testProp} opponent={testProp} />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})