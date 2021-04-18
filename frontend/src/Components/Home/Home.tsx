import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Home.module.scss';
import { useServer } from '../../Context/serverContext';
import { useAuth } from '../../Context/authContext';
import Button from '../Button';

const Home: React.FC = ({ children }) => {
  const { gameState, serverDispatch } = useServer();
  const { gameHasEnoughPlayers } = gameState;
  const { authState, authDispatch } = useAuth();
  const { displayName } = authState;
  const history = useHistory();

  useEffect(() => {
    if (gameHasEnoughPlayers) {
      history.push('/game');
    }
  }, [gameHasEnoughPlayers]);

  const logoutHome = () => {
    serverDispatch({ type: 'resetServer' });
    authDispatch({ type: 'logout' });
    history.push('/');
  };

  return (
    <section className={styles.Home}>
      <h1>Heads Up Poker</h1>
      <Button logic={logoutHome} text="Logout" />
      <h3>
        Hi,
        {displayName}
      </h3>
      {/* redirect or buttons to access game? */}
      {children}
    </section>
  );
};

export default Home;
