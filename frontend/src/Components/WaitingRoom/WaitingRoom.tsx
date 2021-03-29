import React from 'react';
import styles from './WaitingRoom.module.scss';
import { useServer } from '../../Context/serverContext';
import Button from '../Button';

const WaitingRoom: React.FC = () => {
  const { gameState, gameDispatch } = useServer();
  const { displayName, gid } = gameState;
  return (
    <section className={styles.WaitingRoom}>
      <Button logic={() => gameDispatch({ type: 'removeGid' })} text="Back" />
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
