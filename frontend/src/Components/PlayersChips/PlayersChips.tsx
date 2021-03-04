import React from "react";
import { Iplayer } from '../../Context/interfaces';
import ChipsGen from "../ChipsGen";
import {useSpring, animated} from 'react-spring'
import styles from "./PlayerChips.module.scss";


interface IProps {
  which: string,
  player: Iplayer,
  stage: string
}

const PlayerChips: React.FC<IProps> = ({which, player, stage}) => {

  const aniProps = useSpring({ opacity: 1, from: {opacity: 0} })

  return (

    <div className={styles.PlayersChips}>
    {player['bet-size'] > 0 && stage !== "winner" ? (
      <>
        <p>{which} bet: {player['bet-size']}</p>
        <animated.div style={aniProps}>
          <ChipsGen amount={player['bet-size']} />
        </animated.div>
      </>
    ) : ''}
  </div>

  );
}
export default PlayerChips;