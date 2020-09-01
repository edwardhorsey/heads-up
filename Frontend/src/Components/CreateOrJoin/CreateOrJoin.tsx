import React, { useState, useContext } from "react";
import styles from "./CreateOrJoin.module.scss";
import { ServerContext, socket } from '../../Context/serverContext';
// import Button from "../Button";

interface IProps {

}

const CreateOrJoin: React.FC<IProps> = (props) => {
  const [input, setInput] = useState('Game ID')
    
  const context = useContext(ServerContext);
  console.log('hi from CreateOrJoin', context);

  const createGame = () => {
    const request = {
      'method': 'create-game',
      'uid': context.cState.uid,
      'display-name': context.cState.displayName
    };
    socket.send(JSON.stringify(request));
  }

  const joinGame = () => {
      const request = {
        'method': 'join-game',
        'uid': context.cState.uid,
        'display-name': context.cState.displayName,
        'gid': input
      };
      socket.send(JSON.stringify(request));
  }

  return (
    <section className={styles.CreateOrJoin}>
      <h3>Create or Join a game</h3>
      <button onClick={() => {createGame()}}>Create game</button>
      <input type="text" name="gid-input" value={input} onChange={(event) => {setInput(event.target.value)}}/>
      <button onClick={() => {joinGame()}}>Join a game</button>
    </section>
  );
};

export default CreateOrJoin;
