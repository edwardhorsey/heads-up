import React, { useContext } from 'react';
import { shallow } from 'enzyme';
import Lobby from '../Lobby/Lobby';
import { ServerContext } from '../../Context/serverContext';


describe("Lobby tests", () => {
  const context = useContext(ServerContext);
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