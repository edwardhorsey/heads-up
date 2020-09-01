import React, {useState, useContext} from "react";
import styles from "./GameContainer.module.scss";
import { socket, ServerContext } from '../../Context/serverContext';

const GameContainer: React.FC = () => {
  // const [input, setInput] = useState('Game ID')

  const context = useContext(ServerContext);
  console.log('hi from GameContainer', context);

  return (
    <section className={styles.GameContainer}>
      <h2>GameContainer</h2>
      <h3>GameID: {context.cState.gid}</h3>
      <h3>Welcome {context.cState.displayName} and {context.cState.opponentName}</h3>
    </section>
  );
};

export default GameContainer;
