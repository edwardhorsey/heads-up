import React, { useContext } from "react";
import styles from "./WaitingRoom.module.scss";
import { ServerContext } from '../../Context/serverContext';
import Button from "../Button";

const WaitingRoom: React.FC = () => {
  
  const context = useContext(ServerContext)
  const { displayName, gid, setCState } = context
  return (
    <section className={styles.WaitingRoom}>
      <div className={styles.backButton}>
        <Button logic={()=>{setCState({...context, gid: 0})}} text={'Back'} />
      </div>
      <h3>Waiting room</h3>
      <p>{displayName}</p>
      <p>Game ID: {gid}</p>
      <p>Waiting for second player...</p>
    </section>
  );
};

export default WaitingRoom;