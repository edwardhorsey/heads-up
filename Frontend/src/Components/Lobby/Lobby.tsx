import React, {useState, useContext} from "react";
import styles from "./Lobby.module.scss";
// import Button from "../Button";
import { socket, ServerContext } from '../../Context/serverContext';

const Lobby: React.FC = () => {
  const [input, setInput] = useState('Game ID')

  const context = useContext(ServerContext);
  const createGame = () => {
    const request = {
      'method': 'create-game',
      'uid': context.cState.uid,
      'display-name': context.cState.displayName
    };
    socket.send(JSON.stringify(request));
  }

  return (
    <section className={styles.Lobby}>
      <h2>Lobby</h2>
      <h3>Welcome, {context.cState.displayName}</h3>
      <h3>Create or Join a game</h3>
      <button onClick={()=>{createGame()}}>Create game</button>
      <input type="text" name="gid-input" value={input} onChange={(event) => {setInput(event.target.value)}}/>
      <button>Join a game</button>
    </section>
  );
};

export default Lobby;
