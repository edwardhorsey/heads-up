import React from 'react';
import styles from './Home.module.scss';
import { useServer } from '../../Context/serverContext';
import { useAuth } from '../../Context/authContext';
import Lobby from '../Lobby';
import GameContainer from '../GameContainer';
import Button from '../Button';

const Home: React.FC = () => {
  const { serverState, serverDispatch } = useServer();
  const { readyToStart } = serverState;
  const { authState, authDispatch } = useAuth();
  const { displayName } = authState;
  const logoutHome = () => {
    serverDispatch({ type: 'resetServer' });
    authDispatch({ type: 'logout' });
  };

  return (
    <section className={styles.Home}>
      <h1>Heads Up Poker</h1>
      <Button logic={logoutHome} text="Logout" />
      {readyToStart ? <GameContainer /> : <Lobby displayName={displayName} />}
      {' '}
      {/* redirect or buttons to access game? */}
    </section>
  );
};

export default Home;
