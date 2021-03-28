import React from "react";
import styles from "./Lobby.module.scss";
import CreateOrJoin from "../CreateOrJoin";
import { useServer } from '../../Context/serverContext';
import WaitingRoom from "../WaitingRoom";

interface LobbyProps {
  displayName: string;
}

const Lobby: React.FC<LobbyProps> = ({displayName}) => {
  const { serverState } = useServer();
  const { gid } = serverState;
  return (
    <section className={styles.Lobby}>
      <h3>Welcome, {displayName}</h3>
      {gid ? <WaitingRoom /> : <CreateOrJoin />}
    </section>
  );
};

export default Lobby;