import React from 'react';
import styles from './GameNav.module.scss';
import { Iplayer, Hand, Stage } from '../../Interfaces/interfaces';
import PlayerStats from '../PlayerStats';

interface IProps {
  yourself: Iplayer;
  opponent: Iplayer;
  stage: Stage;
  yourHand: Hand;
}

const GameNav: React.FC<IProps> = ({
  yourself,
  opponent,
  stage,
  yourHand,
}) => (
  <article className={styles.Nav}>
    <div>
      <PlayerStats player={yourself} stage={stage} yourHand={yourHand} />
      {yourself['rounds-won'] > 0
        ? (
          <p>
            Rounds won
            {yourself['rounds-won']}
          </p>
        )
        : ''}
      {yourself.ready && !opponent.ready
        ? (
          <p className={styles.Ready}>
            Ready
          </p>
        ) : ''}
    </div>
    <div>
      <PlayerStats player={opponent} stage={stage} yourHand={yourHand} />
      {opponent['rounds-won'] > 0
        ? (
          <p>
            Rounds won
            {opponent['rounds-won']}
          </p>
        )
        : ''}
      {opponent.ready && !yourself.ready
        ? (
          <p className={styles.Ready}>
            Ready
          </p>
        ) : ''}
    </div>
  </article>
);

export default GameNav;
