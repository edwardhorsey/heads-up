import React from 'react';
import { useSpring, animated } from 'react-spring';
import { Iplayer, Stage } from '../../Interfaces/interfaces';
import ChipsGen from '../ChipsGen';
import styles from './PlayerChips.module.scss';

interface IProps {
  which: 'Opponent' | 'Your',
  player: Iplayer,
  stage: Stage
}

const PlayerChips: React.FC<IProps> = ({ which, player, stage }) => {
  const aniProps = useSpring({ opacity: 1, from: { opacity: 0 } });

  return (

    <div className={styles.PlayersChips}>
      {player['bet-size'] > 0 && stage !== 'winner' ? (
        <>
          <p>
            {which}
            {' '}
            bet:
            {' '}
            {player['bet-size']}
          </p>
          <animated.div style={aniProps}>
            <ChipsGen amount={player['bet-size']} />
          </animated.div>
        </>
      ) : ''}
    </div>

  );
};
export default PlayerChips;
