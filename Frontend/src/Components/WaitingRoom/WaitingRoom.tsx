import React, { useState, useContext } from "react";
import styles from "./WaitingRoom.module.scss";
import { ServerContext, socket } from '../../Context/serverContext';

const WaitingRoom: React.FC = (props) => {
  
  const context = useContext(ServerContext)
  console.log('hi from WaitingRoom', context)

  return (
    <section className={styles.WaitingRoom}>
      <h3>Waiting room</h3>
        <p>{context.cState.displayName}</p>
        <p>Game ID: {context.cState.gid}</p>
        <p>Waiting for second player...</p>
    </section>
  );
};

export default WaitingRoom;
