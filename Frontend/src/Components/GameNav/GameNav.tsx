import React, { useContext } from "react";
import styles from "./GameNav.module.scss";
import { ServerContext } from '../../Context/serverContext';


interface Iplayer {
  name: string,
  bankroll: number,
  ready: boolean,
  blind: number
}

interface IProps {
  yourself: Iplayer,
  opponent: Iplayer
}

const GameNav: React.FC<IProps> = ({yourself, opponent}) => {

  const context = useContext(ServerContext);
  console.log('hi from GameNav', context);

  return (
    <article className={styles.Nav}>
        <div>
          <p className={styles.playerName}>{yourself.name}</p>
          <p>Bankroll: {yourself.bankroll}</p>
          {yourself.ready ? <p className={styles.Ready}>Ready</p> : ''}
        </div>
        <div>
          <p className={styles.playerName}>{opponent.name}</p>
          <p>Bankroll: {opponent.bankroll}</p>
          {opponent.ready ? <p className={styles.Ready}>Ready</p> : ''}
        </div>
      </article>
  )
}

export default GameNav;
