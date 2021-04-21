import React from 'react';
import styles from './PlayerStats.module.scss';
import { Iplayer, Hand, Stage } from '../../Interfaces/interfaces';

interface IProps {
  player: Iplayer;
  who?: 'opp' | 'you';
  stage: Stage;
  yourHand: Hand;
}

const PlayerStats: React.FC<IProps> = ({
  player, who, stage, yourHand,
}) => {
  const roundProfit = () => (
    <p className={player.profit >= 0 ? styles.profit : styles.loss}>
      {player.profit}
    </p>
  );

  const playerBackground = yourHand.length > 0
    ? `${styles.playerName} ${styles.background}`
    : styles.playerName;

  return (
    <div className={styles.playerStats}>
      {who === 'you' && stage === 'winner' && roundProfit()}
      <div className={playerBackground}>
        <p className={styles.name}>{player.name}</p>
        <p>{`Chips: ${player.chips}`}</p>
      </div>
      {who === 'opp' && stage === 'winner' && roundProfit()}
    </div>
  );
};

export default PlayerStats;
