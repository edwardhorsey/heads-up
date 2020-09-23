import React from 'react'
import { useTransition, animated } from 'react-spring'
import styles from "./RoundWinner.module.scss";


interface IProps {
  text: string
}

const RoundWinner: React.FC<IProps> = ({text}) => {

  const transitions = useTransition(text, null, {
    from: { transform: 'rotateX(-30deg)', opacity: 0 },
    enter: [
      { opacity: 1, height: 80 },
      { transform: 'rotateX(30deg)'  },
      { transform: 'rotateX(0deg)' },
    ],
    leave: { transform: 'translate3d(0,0px,0)' }
  });

  const output = transitions.map(({ item,  props , key }) =>
  <animated.div key={key} style={props}>{item}</animated.div>
  );

  return (
    <h3 className={styles.RoundWinner}>{output}</h3>
  );
}

export default RoundWinner;
 
