import React from 'react';
import { shallow } from 'enzyme';
import PlayersCards from './PlayersCards';
import PlayingCard from '../PlayingCard';

describe('PlayersCards tests', () => {
  let component: any;
  let mockFn;
  const cards = [<PlayingCard key={1} winner={false} card={['a', 'clubs']} />, <PlayingCard key={2} winner={false} card={['a', 'hearts']} />];

  beforeEach(() => {
    mockFn = jest.fn();
    component = shallow(<PlayersCards cards={cards} />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
