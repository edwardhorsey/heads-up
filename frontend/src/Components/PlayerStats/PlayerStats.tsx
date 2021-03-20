import React from "react";
import styles from "./PlayerStats.module.scss";
import { Iplayer, Hand } from '../../Interfaces/interfaces';

interface IProps {
  player: Iplayer;
  who?: string;
  stage: string;
  yourHand:  Hand;
}

const PlayerStats: React.FC<IProps> = ({player, who, stage, yourHand}) => {
  const roundProfit = () => stage === 'winner' ? <p className={player.profit >= 0 ? styles.profit : styles.loss}>{player.profit}</p> : '';
  const playerBackground = yourHand.length > 0 ? `${styles.playerName} ${styles.background}` : styles.playerName;

  return (
    <div className={styles.playerStats}>
      {who === "you" ? roundProfit() : ''}
      <div className={playerBackground}>
        <p className={styles.name}>{player.name}</p>
        <p>Bankroll: {player.bankroll}</p>
      </div>
      {who === "opp" ? roundProfit() : ''}
    </div>
  )
}

export default PlayerStats;