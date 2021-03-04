import React, { useContext, Dispatch, SetStateAction } from "react";
import styles from "./GameContainer.module.scss";
import { ServerContext } from '../../Context/serverContext';
import { Iplayer } from '../../Context/interfaces';
import socket from "../../Socket/socket";
import GameNav from "../GameNav";
import GameHand from "../GameHand";
import Button from "../Button";
import { createStatement } from "typescript";

const GameContainer: React.FC = () => {
  const context = useContext(ServerContext);
  const { uid, gid, players, whichPlayer, yourHand, noOfRounds, stage, setCState, inHand } = context;
  const yourself: Iplayer = players[whichPlayer]; // yourself is user
  const opponent: Iplayer = players[whichPlayer === 0 ? 1: 0]; // opponent is opponent

  const readyToPlayHand = () => {
    const request = {
      method: 'ready-to-play',
      uid: uid,
      gid: gid,
      ready: true
    }
    socket.send(JSON.stringify(request));
  }

  if (yourHand.length > 0 && !inHand) {
    setCState({...context, inHand: true})
  }

  return (
    <section className={styles.GameContainer}>
      <div className={styles.gameStats}>
        <h3>GameID: {gid}</h3>
        <p>Total rounds: {noOfRounds}</p>
      </div>
      {stage === 'initial' && <h3>Welcome {yourself.name} and {opponent.name}</h3>}
      {yourHand.length === 0 && <GameNav yourself={yourself} opponent={opponent} /> }
      {(!yourself.ready && ['initial', 'back-to-lobby', ].includes(stage)) && <Button logic={readyToPlayHand} text="Play round" />}
      {yourHand.length > 0 && <GameHand yourself={yourself} opponent={opponent} />}
    </section>
  );
};

export default GameContainer;