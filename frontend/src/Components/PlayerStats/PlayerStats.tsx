import React, { useContext } from "react";
import styles from "./PlayerStats.module.scss";
import { ServerContext } from '../../Context/serverContext';
import { Iplayer } from '../../Context/interfaces';

interface IProps {
  player: Iplayer,
  who?: string
}

const PlayerStats: React.FC<IProps> = ({player, who}) => {

  const context = useContext(ServerContext);
  const { stage, yourHand } = context;

  const roundProfit = () => stage === 'winner' ? <p className={player.profit >= 0 ? styles.profit : styles.loss}>{player.profit}</p> : ''
  const playerBackground = () => yourHand.length > 0 ? `${styles.playerName} ${styles.background}` : styles.playerName

  return (
    <div className={styles.playerStats}>
      {who === "you" ? roundProfit() : ''}
      <div className={playerBackground()}>
        <p className={styles.name}>{player.name}</p>
        <p>Bankroll: {player.bankroll}</p>
      </div>
      {who === "opp" ? roundProfit() : ''}
    </div>
  )
}

export default PlayerStats;