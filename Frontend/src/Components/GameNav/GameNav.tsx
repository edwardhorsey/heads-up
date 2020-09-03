import React, { useContext } from "react";
import styles from "./GameNav.module.scss";
import { ServerContext } from '../../Context/serverContext';


interface Iplayer {
  name: string,
  bankroll: number,
  ready: boolean
}

interface IProps {
  playerOne: Iplayer,
  playerTwo: Iplayer
}

const GameNav: React.FC<IProps> = ({playerOne, playerTwo}) => {

  const context = useContext(ServerContext);
  console.log('hi from GameNav', context);

  return (
    <article className={styles.Nav}>
        <div className={styles.playerOne}>
          <p className={styles.playerName}>{playerOne.name}</p>
          <p>Bankroll: {playerOne.bankroll}</p>
          {playerOne.ready ? <p className={styles.Ready}>Ready</p> : ''}
        </div>
        <div className={styles.playerTwo}>
          <p className={styles.playerName}>{playerTwo.name}</p>
          <p>Bankroll: {playerTwo.bankroll}</p>
          {playerTwo.ready ? <p className={styles.Ready}>Ready</p> : ''}
        </div>
      </article>
  )
}

export default GameNav;
