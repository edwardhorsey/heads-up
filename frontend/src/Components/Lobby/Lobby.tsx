import React from 'react';
import styles from './Lobby.module.scss';
import CreateOrJoin from '../CreateOrJoin';
import { useServer } from '../../Context/serverContext';
import WaitingRoom from '../WaitingRoom';

interface LobbyProps {
  displayName: string;
}

const Lobby: React.FC<LobbyProps> = ({ displayName }) => {
  const { gameState } = useServer();
  const { gid } = gameState;
  return (
    <section className={styles.Lobby}>
      <h3>
        Hi,
        {displayName}
      </h3>
      {gid ? <WaitingRoom /> : <CreateOrJoin />}
    </section>
  );
};

export default Lobby;
