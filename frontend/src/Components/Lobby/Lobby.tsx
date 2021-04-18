import React from 'react';
import styles from './Lobby.module.scss';
import CreateOrJoin from '../CreateOrJoin';
import { useServer } from '../../Context/serverContext';
import WaitingRoom from '../WaitingRoom';

const Lobby: React.FC = () => {
  const { gameState } = useServer();
  const { gid } = gameState;
  return (
    <section className={styles.Lobby}>
      {gid ? <WaitingRoom /> : <CreateOrJoin />}
    </section>
  );
};

export default Lobby;
