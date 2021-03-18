import React, { useContext } from "react";
import styles from "./WaitingRoom.module.scss";
import { ServerContext } from '../../Context/serverContext';
import Button from "../Button";

const WaitingRoom: React.FC = () => {
  
  const context = useContext(ServerContext)
  const { serverState, serverDispatch } = context;
  const { displayName, gid } = serverState;
  return (
    <section className={styles.WaitingRoom}>
      <Button logic={()=>serverDispatch({ type: 'removeGid' })} text={'Back'} />
      <p>{displayName}</p>
      <p>Game ID: {gid}</p>
      <p>Waiting for second player...</p>
    </section>
  );
};

export default WaitingRoom;