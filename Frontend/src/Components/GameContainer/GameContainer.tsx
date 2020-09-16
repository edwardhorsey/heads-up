import React, { useContext } from "react";
import styles from "./GameContainer.module.scss";
import { ServerContext } from '../../Context/serverContext';
import socket from "../../Socket/socket";
import GameNav from "../GameNav";
import GameHand from "../GameHand";
import Button from "../Button";

const GameContainer: React.FC = () => {
  const context = useContext(ServerContext);
  const { uid, gid, players, whichPlayer, noOfHands, yourHand, oppHand, pot, community, noOfRounds } = context;
  const yourself = {...players[whichPlayer]}; // yourself is user
  const opponent = {...players[whichPlayer === 0 ? 1: 0]}; // opponent is opponent

  const readyToPlayHand = () => {
    const request = {
      method: 'ready-to-play',
      uid: uid,
      gid: gid,
      ready: true
    }
    socket.send(JSON.stringify(request));
  }

  return (
    <section className={styles.GameContainer}>
      <h2>Game Container</h2>
      <div className={styles.gameStats}>
        <p>GameID: {gid}</p>
        <p>Rounds: {noOfRounds}</p>
      </div>
      <h3>Welcome {yourself.name} and {opponent.name}</h3>
      <GameNav yourself={yourself} opponent={opponent} />
      {!yourself.ready ? <Button logic={readyToPlayHand} text="Play round" /> : ''}
      {yourHand.length > 0 ? <GameHand noOfHands={noOfHands} yourHand={yourHand} oppHand={oppHand} community={community} pot={pot} yourself={yourself} opponent={opponent} /> : ''}
    </section>
  );
};

export default GameContainer;