import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './GameContainer.module.scss';
import { useServer } from '../../Context/serverContext';
import { Iplayer } from '../../Interfaces/interfaces';
import { leaveGame, readyToPlayHand } from '../../Socket/requests';
import GameNav from '../GameNav';
import GameHand from '../GameHand';
import Button from '../Button';
import AddChips from '../AddChips';
import Announcement from '../Announcement';
import Timer from '../Timer';

const GameContainer: React.FC = () => {
  const { gameState, serverState } = useServer();
  const { uid } = serverState;
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
    gameHasEnoughPlayers,
    playerLeftMessage,
  } = gameState;

  const history = useHistory();

  useEffect(() => {
    if (!gameHasEnoughPlayers) {
      history.push('/');
    }
  }, [gameHasEnoughPlayers, history]);

  // yourself is user
  const yourself: Iplayer = players[whichPlayer];
  const { chips } = yourself;
  // opponent is opponent
  const opponent: Iplayer = players[whichPlayer === 0 ? 1 : 0];
  const gameMinimumBuyIn = 1500;

  return (
    <section className={styles.GameContainer}>
      <Button
        logic={() => leaveGame(gid)}
        text="Back"
      />
      <div className={styles.gameStats}>
        <h3>{`GameID: ${gid}`}</h3>
        <p>{`Total rounds: ${noOfRounds}`}</p>
      </div>
      {yourHand.length === 0 && (
        <GameNav
          yourself={yourself}
          opponent={opponent}
          stage={stage}
          yourHand={yourHand}
        />
      )}
      {playerLeftMessage && <Announcement text={playerLeftMessage} />}
      {playerLeftMessage && (
        <>
          <p>Leaving in...</p>
          <Timer num={10} logic={() => leaveGame(gid)} />
        </>
      )}
      {(
        !yourself.chips
        && ['initial', 'backToLobby'].includes(stage)
        && !playerLeftMessage
      ) && (
        <AddChips
          numChips={chips}
          minimum={gameMinimumBuyIn}
          gid={gid}
          uid={uid}
        />
      )}
      {(
        !yourself.ready
        && ['initial', 'backToLobby'].includes(stage)
        && !playerLeftMessage
        && !!yourself.chips
      ) && (
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
