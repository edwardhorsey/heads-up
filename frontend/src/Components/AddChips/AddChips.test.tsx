import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import AddChips from './AddChips';

describe('AddChips tests', () => {
  let component: ShallowWrapper<React.FC>;

  beforeEach(() => {
    component = shallow(
      <AddChips
        numChips={130}
        minimum={500}
        gid="abcdefghij"
        uid="dlkajwd038ut3490hjlgfkjhlsa"
      />,
    );
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
