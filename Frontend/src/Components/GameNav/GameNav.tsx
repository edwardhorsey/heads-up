import React from "react";
import styles from "./GameNav.module.scss";

interface Iplayer {
  name: string,
  bankroll: number
}

interface IProps {
  playerOne: Iplayer,
  playerTwo: Iplayer
}

const GameNav: React.FC<IProps> = ({playerOne, playerTwo}) => {
  return (
    <article className={styles.Nav}>
        <div className={styles.playerTwo}>
          <p className={styles.playerName}>{playerTwo.name}</p>
          <p>Bankroll: {playerTwo.bankroll}</p>
        </div>
        <div className={styles.playerOne}>
          <p className={styles.playerName}>{playerOne.name}</p>
          <p>Bankroll: {playerOne.bankroll}</p>
        </div>
      </article>
  )
}

export default GameNav;
