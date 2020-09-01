import React, {useState, useContext} from "react";
import styles from "./Lobby.module.scss";
import CreateOrJoin from "../CreateOrJoin";
import { socket, ServerContext } from '../../Context/serverContext';
import WaitingRoom from "../WaitingRoom";

const Lobby: React.FC = () => {
  const [input, setInput] = useState('Game ID')

  const context = useContext(ServerContext);
  console.log('hi from lobby', context);

  return (
    <section className={styles.Lobby}>
      <h2>Lobby</h2>
      <h3>Welcome, {context.cState.displayName}</h3>
      {context.cState.gid ? <WaitingRoom /> : <CreateOrJoin />}
    </section>
  );
};

export default Lobby;
