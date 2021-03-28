import React from 'react';
import { useTransition, animated } from 'react-spring';
import styles from './CommunityCards.module.scss';

interface IProps {
  cards: JSX.Element[]
}

const CommunityCards: React.FC<IProps> = ({ cards }) => {
  const transitions = useTransition(cards, [0, 1, 2, 3, 4], {
    from: { transform: 'translate3d(-70px, 0, 0)', opacity: 0 },
    enter: { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    leave: { transform: 'translate3d(0,0px,0)' },
    trail: 100,
  });

  const output = transitions.map(({ item, props, key }) => (
    <animated.div key={key} style={props}>{item}</animated.div>
  ));

  return (
    <article className={styles.Community}>
      {output}
    </article>
  );
};

export default CommunityCards;
