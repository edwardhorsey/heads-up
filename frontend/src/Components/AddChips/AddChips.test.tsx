import React from 'react';
import { shallow } from 'enzyme';
import AddChips from './AddChips';

describe('AddChips tests', () => {
  let component: any;
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<AddChips numChips={130} minimum={500} />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
