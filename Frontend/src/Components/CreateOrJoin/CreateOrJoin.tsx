import React, { useState, useContext } from "react";
import styles from "./CreateOrJoin.module.scss";
import { ServerContext, socket } from '../../Context/serverContext';
import Button from "../Button";

interface IProps {

}

const CreateOrJoin: React.FC<IProps> = (props) => {
  const [input, setInput] = useState('Game ID')
    
  const context = useContext(ServerContext);
  console.log('hi from CreateOrJoin', context);

  const { uid, displayName } = context.cState;

  const createGame = () => {
    const request = {
      'method': 'create-game',
      'uid': uid,
      'display-name': displayName
    };
    socket.send(JSON.stringify(request));
  }

  const joinGame = () => {
      const request = {
        'method': 'join-game',
        'uid': uid,
        'display-name': displayName,
        'gid': input
      };
      socket.send(JSON.stringify(request));
  }

  return (
    <section className={styles.CreateOrJoin}>
      <h3>Create or Join a game</h3>
      <Button logic={createGame} text="Create game" />
      <input type="text" name="gid-input" value={input} onChange={(event) => {setInput(event.target.value)}}/>
      <Button logic={joinGame} text="Join a game" />
    </section>
  );
};

export default CreateOrJoin;
