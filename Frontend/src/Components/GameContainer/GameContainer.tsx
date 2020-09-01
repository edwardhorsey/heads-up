import React, {useState, useContext} from "react";
import styles from "./GameContainer.module.scss";
import { socket, ServerContext } from '../../Context/serverContext';

const GameContainer: React.FC = () => {
  // const [input, setInput] = useState('Game ID')

  const context = useContext(ServerContext);
  console.log('hi from GameContainer', context);

  const playerOne = context.cState.players[context.cState.whichPlayer];
  const playerTwo = context.cState.players[context.cState.whichPlayer === 0 ? 1: 0];
  console.log(playerOne, playerTwo)

  return (
    <section className={styles.GameContainer}>
      <h2>GameContainer</h2>
      <h3>GameID: {context.cState.gid}</h3>
      <h3>Welcome {playerOne.name} and {playerTwo.name}</h3>
      <div>
        <h4>{playerTwo.name}</h4>
        <h5>Bankroll: {playerTwo.bankroll}</h5>
      </div>
      <div>
        <h3>{playerOne.name}</h3>
        <h4>Bankroll: {playerOne.bankroll}</h4>
      </div>
      <button onClick={()=>{console.log('play hand')}}>Play hand</button>
    </section>
  );
};

export default GameContainer;
