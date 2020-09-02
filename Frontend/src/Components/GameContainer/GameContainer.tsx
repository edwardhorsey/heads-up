import React, {useState, useContext} from "react";
import styles from "./GameContainer.module.scss";
import { socket, ServerContext } from '../../Context/serverContext';
import GameNav from "../GameNav";
import Button from "../Button";

const GameContainer: React.FC = () => {
  // const [input, setInput] = useState('Game Container')

  const context = useContext(ServerContext);
  console.log('hi from GameContainer', context);
  const { uid, gid, players, whichPlayer } = context.cState;

  const playerOne = players[whichPlayer];
  const playerTwo = players[whichPlayer === 0 ? 1: 0];

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
      <h3>GameID: {gid}</h3>
      <h3>Welcome {playerOne.name} and {playerTwo.name}</h3>
      <GameNav playerOne={playerOne} playerTwo={playerTwo} />
      <Button logic={readyToPlayHand} text="Play hand" />
    </section>
  );
};

export default GameContainer;