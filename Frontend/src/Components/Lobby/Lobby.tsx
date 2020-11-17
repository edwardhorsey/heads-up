import React, { useContext } from "react";
import styles from "./Lobby.module.scss";
import CreateOrJoin from "../CreateOrJoin";
import { ServerContext } from '../../Context/serverContext';
import WaitingRoom from "../WaitingRoom";
import Timer from "../Timer";

const Lobby: React.FC = () => {
  const context = useContext(ServerContext);
  const { gid } = context;
  return (
    <section className={styles.Lobby}>
      <h2>Lobby</h2>
      <h3>Welcome, {context.displayName}</h3>
      {gid ? <WaitingRoom /> : <CreateOrJoin />}
      {/* <Timer num={10} logic={()=><h2>times up</h2>} /> */}
    </section>
  );
};

export default Lobby;