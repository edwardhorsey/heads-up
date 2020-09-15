import React, { useContext } from "react";
import styles from "./WaitingRoom.module.scss";
import { ServerContext } from '../../Context/serverContext';

const WaitingRoom: React.FC = () => {
  
  const context = useContext(ServerContext)
  const { displayName, gid } = context
  return (
    <section className={styles.WaitingRoom}>
      <h3>Waiting room</h3>
        <p>{displayName}</p>
        <p>Game ID: {gid}</p>
        <p>Waiting for second player...</p>
    </section>
  );
};

export default WaitingRoom;
