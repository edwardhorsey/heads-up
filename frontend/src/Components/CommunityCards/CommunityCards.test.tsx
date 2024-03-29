import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import CommunityCards from './CommunityCards';
import PlayingCard from '../PlayingCard';

describe('CommunityCards tests', () => {
  let component: ShallowWrapper<React.FC>;
  const cards = [
    <PlayingCard key={1} winner={false} card={['2', 'clubs']} />,
    <PlayingCard key={2} winner={false} card={['7', 'hearts']} />,
    <PlayingCard key={3} winner={false} card={['4', 'clubs']} />,
    <PlayingCard key={4} winner={false} card={['j', 'spades']} />,
    <PlayingCard key={5} winner={false} card={['10', 'spades']} />,
  ];

  beforeEach(() => {
    component = shallow(<CommunityCards cards={cards} />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
