import React from "react";
import { useTransition, animated } from 'react-spring';
import styles from "./PlayersCards.module.scss";

interface IProps {
  cards: JSX.Element[]
}

const PlayersCards: React.FC<IProps> = ({cards}) => {

  const transitions = useTransition(cards, [0,1], {
    from: { transform: `translate3d(0, -10px, 0)`, opacity: 0 },
    enter: { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    leave: { transform: 'translate3d(0,0px,0)' },
    trail: 50,
  });

  const output = transitions.map(({ item, props, key }) =>
  <animated.div key={key} style={props}>{item}</animated.div>
  );

  return (
    <article className={styles.PlayersCards}>
      {output}
    </article>
  );
}
export default PlayersCards;
