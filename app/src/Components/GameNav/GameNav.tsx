import React from "react";
import styles from "./GameNav.module.scss";
import { Iplayer } from '../../Context/serverContext';
import PlayerStats from "../PlayerStats";

interface IProps {
  yourself: Iplayer,
  opponent: Iplayer
}

const GameNav: React.FC<IProps> = ({yourself, opponent}) => {
  return (
    <article className={styles.Nav}>
        <div>
          <PlayerStats player={yourself} />
          {yourself['rounds-won'] > 0 ? <p>Rounds won {yourself['rounds-won']}</p> : ''}
          {yourself.ready && !opponent.ready ? <p className={styles.Ready}>Ready</p> : ''}
        </div>
        <div>
          <PlayerStats player={opponent} />
          {opponent['rounds-won'] > 0 ? <p>Rounds won {opponent['rounds-won']}</p> : ''}
          {opponent.ready && !yourself.ready ? <p className={styles.Ready}>Ready</p> : ''}
        </div>
      </article>
  )
}

export default GameNav;