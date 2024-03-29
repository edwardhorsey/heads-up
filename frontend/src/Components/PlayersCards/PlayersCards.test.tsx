import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import PlayersCards from './PlayersCards';
import PlayingCard from '../PlayingCard';

describe('PlayersCards tests', () => {
  let component: ShallowWrapper<React.FC>;
  const cards = [
    <PlayingCard
      key={1}
      winner={false}
      card={['a', 'clubs']}
    />,
    <PlayingCard
      key={2}
      winner={false}
      card={['a', 'hearts']}
    />,
  ];

  beforeEach(() => {
    component = shallow(<PlayersCards cards={cards} />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
  });
});
