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
  const { bankroll, displayName } = authState;
  const history = useHistory();

  useEffect(() => {
    if (gameHasEnoughPlayers) {
      history.push('/game');
    }
  }, [gameHasEnoughPlayers, history]);

  const logoutHome = () => {
    serverDispatch({ type: 'resetServer' });
    authDispatch({ type: 'logout' });
    history.push('/');
  };

  return (
    <section className={styles.Home}>
      <nav className={styles.Nav}>
        <h1>Heads Up Poker</h1>
        <div className={styles.NavItems}>
          <h3>{`Hi, ${displayName}`}</h3>
          <h3>{`Bankroll: ${bankroll}`}</h3>
          <Button logic={logoutHome} text="Logout" />
        </div>
      </nav>
      {/* redirect or buttons to access game? */}
      {children}
    </section>
  );
};

export default Home;
