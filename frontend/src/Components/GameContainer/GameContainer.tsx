import React from 'react';
import styles from './GameContainer.module.scss';
import { useServer } from '../../Context/serverContext';
import { Iplayer } from '../../Interfaces/interfaces';
import { readyToPlayHand } from '../../Socket/requests';
import GameNav from '../GameNav';
import GameHand from '../GameHand';
import Button from '../Button';
/* import { leaveGame } from '../../Socket/requests'; */

const GameContainer: React.FC = () => {
  const { gameState, serverState } = useServer();
  const { uid /* inHand */ } = serverState;
  const {
    gid,
    players,
    whichPlayer,
    yourHand,
    noOfRounds,
    stage,
    oppHand,
    winner,
    winningHand,
    pot,
    community,
    noOfHands,
    action,
  } = gameState;

  // yourself is user
  const yourself: Iplayer = players[whichPlayer];
  // opponent is opponent
  const opponent: Iplayer = players[whichPlayer === 0 ? 1 : 0];

  return (
    <section className={styles.GameContainer}>
      {/* <Button logic={() => leaveGame} text={'Back'} /> */}
      <div className={styles.gameStats}>
        <h3>
          GameID:
          {gid}
        </h3>
        <p>
          Total rounds:
          {noOfRounds}
        </p>
      </div>
      {yourHand.length === 0 && (
        <GameNav
          yourself={yourself}
          opponent={opponent}
          stage={stage}
          yourHand={yourHand}
        />
      )}
      {(!yourself.ready && ['initial', 'backToLobby'].includes(stage)) && (
        <Button logic={() => readyToPlayHand(gid, uid)} text="Play round" />
      )}
      {yourHand.length > 0 && (
        <GameHand
          action={action}
          community={community}
          noOfHands={noOfHands}
          opponent={opponent}
          oppHand={oppHand}
          pot={pot}
          stage={stage}
          winner={winner}
          winningHand={winningHand}
          whichPlayer={whichPlayer}
          yourself={yourself}
          yourHand={yourHand}
        />
      )}
    </section>
  );
};

export default GameContainer;
