import React from 'react';
import { shallow } from 'enzyme';
import WaitingRoom from './WaitingRoom';
import * as ServerContext from '../../Context/serverContext';

interface IWaitingRoomTest {
  displayName: 'string'
}

describe("WaitingRoom tests", () => {
  let component: any;
  let mockFn;
  let contextValues = { displayName: 'Testward Horsey' }


  
  jest
    .spyOn(ServerContext, 'ServerProvider')
    .mockImplementation(() => contextValues))


  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<WaitingRoom />);
  })
  
  it("should render", () => {
    expect(component).toBeTruthy();
  })
})