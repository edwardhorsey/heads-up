import React from 'react'
import { useTransition, animated } from 'react-spring'
import styles from "./RoundWinner.module.scss";

interface IProps {
  text: string
}

const RoundWinner: React.FC<IProps> = ({text}) => {

  const transitions = useTransition(text, null, {
    from: { transform: 'scale(1)', opacity: 0 },
    enter: [
      { opacity: 1 },
      { transform: 'scale(1.05)' },
      { transform: 'scale(1)' },
    ],
    leave: { opacity: 0 }
  });

  const output = transitions.map(({ item,  props , key }) =>
  <animated.div key={key} style={props}>{item}</animated.div>
  );

  return (
    <h3 className={styles.RoundWinner}>{output}</h3>
  );
}

export default RoundWinner;