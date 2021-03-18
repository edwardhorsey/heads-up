import React from "react";
import styles from "./Lobby.module.scss";
import CreateOrJoin from "../CreateOrJoin";
import { useServer } from '../../Context/serverContext';
import WaitingRoom from "../WaitingRoom";

const Lobby: React.FC = () => {
  const { serverState } = useServer();
  const { gid, displayName } = serverState;
  return (
    <section className={styles.Lobby}>
      <h3>Welcome, {displayName}</h3>
      {gid ? <WaitingRoom /> : <CreateOrJoin />}
    </section>
  );
};

export default Lobby;