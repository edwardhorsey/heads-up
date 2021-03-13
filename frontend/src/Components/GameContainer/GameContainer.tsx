import React, { useContext } from "react";
import styles from "./GameContainer.module.scss";
import { ServerContext } from '../../Context/serverContext';
import { Iplayer } from '../../Context/interfaces';
import socket from "../../Socket/socket";
import GameNav from "../GameNav";
import GameHand from "../GameHand";
import Button from "../Button";
import { leaveGame } from '../../Socket/requests';

const GameContainer: React.FC = () => {
  const context = useContext(ServerContext);
  const { serverState, setServerState } = context;
  const { uid, gid, players, whichPlayer, yourHand, noOfRounds, stage, inHand } = serverState;
  const yourself: Iplayer = players[whichPlayer]; // yourself is user
  const opponent: Iplayer = players[whichPlayer === 0 ? 1: 0]; // opponent is opponent

  const readyToPlayHand = () => {
    const request = {
      action: 'onGameAction',
      method: 'readyToPlay',
      uid,
      gid,
      ready: true
    }

    socket.send(JSON.stringify(request));
  }

  // Move into the servercontext?
  // if (yourHand.length > 0 && !inHand) {
  //   console.log('is this bad?');
  //   setCState({...context, inHand: true})
  // }

  return (
    <section className={styles.GameContainer}>
      <Button logic={() => leaveGame(gid)} text={'Back'} />
      <div className={styles.gameStats}>
        <h3>GameID: {gid}</h3>
        <p>Total rounds: {noOfRounds}</p>
      </div>
      {yourHand.length === 0 && <GameNav yourself={yourself} opponent={opponent} stage={stage} yourHand={yourHand} /> }
      {(!yourself.ready && ['initial', 'backToLobby', ].includes(stage)) && <Button logic={readyToPlayHand} text="Play round" />}
      {yourHand.length > 0 && <GameHand yourself={yourself} opponent={opponent} />}
    </section>
  );
};

export default GameContainer;