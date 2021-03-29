import React from 'react';
import styles from './WaitingRoom.module.scss';
import { useServer } from '../../Context/serverContext';
import Button from '../Button';

const WaitingRoom: React.FC = () => {
  const { serverState, serverDispatch } = useServer();
  const { displayName, gid } = serverState;
  return (
    <section className={styles.WaitingRoom}>
      <Button logic={() => serverDispatch({ type: 'removeGid' })} text="Back" />
      <p>{displayName}</p>
      <p>
        Game ID:
        {gid}
      </p>
      <p>Waiting for second player...</p>
    </section>
  );
};

export default WaitingRoom;
