import React, { useContext } from "react";
import styles from "./GameNav.module.scss";
import { ServerContext } from '../../Context/serverContext';


interface Iplayer {
  name: string,
  bankroll: number,
  ready: boolean,
  blind: number,
  profit: number,
  'rounds-won': number
}

interface IProps {
  yourself: Iplayer,
  opponent: Iplayer
}

const GameNav: React.FC<IProps> = ({yourself, opponent}) => {

  const context = useContext(ServerContext);
  const { stage } = context;

  return (
    <article className={styles.Nav}>
        <div>
          <p className={styles.playerName}>{yourself.name}</p>
          <p>Bankroll: {yourself.bankroll}</p>
          {yourself['rounds-won'] > 0 ? <p>Rounds won {yourself['rounds-won']}</p> : ''}
          {yourself.ready && !opponent.ready ? <p className={styles.Ready}>Ready</p> : ''}
          {stage === 'winner' ? <p className={yourself.profit >= 0 ? styles.profit : styles.loss}>{yourself.profit}</p> : ''}
        </div>
        <div>
          <p className={styles.playerName}>{opponent.name}</p>
          <p>Bankroll: {opponent.bankroll}</p>
          {opponent['rounds-won'] > 0 ? <p>Rounds won {opponent['rounds-won']}</p> : ''}
          {opponent.ready && !yourself.ready ? <p className={styles.Ready}>Ready</p> : ''}
          {stage === 'winner' ? <p className={opponent.profit >= 0 ? styles.profit : styles.loss}>{opponent.profit}</p> : ''}
        </div>
      </article>
  )
}

export default GameNav;