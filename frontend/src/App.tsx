import React from 'react';
import {
  Switch,
  Route,
  Redirect,
  // Link,
} from 'react-router-dom';
import styles from './App.module.scss';
import ConnectedStatus from './Components/ConnectedStatus';
import { useAuth } from './Context/authContext';
import Login from './Components/Login';
import LoggingIn from './Components/LoggingIn';
import Home from './Components/Home';
import GameContainer from './Components/GameContainer';
import Lobby from './Components/Lobby';

const App: React.FC = () => {
  const { authState } = useAuth();

  return (
    <div className={styles.App}>
      <Route path="/">
        {authState.authToken ? (
          <Home>
            <Switch>
              <Route exact path="/">
                <Lobby />
              </Route>
              <Route exact path="/game">
                <GameContainer />
              </Route>
            </Switch>
          </Home>
        ) : (
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/logging-in">
              <LoggingIn />
            </Route>
            <Redirect to="/" />
          </Switch>
        )}
      </Route>
      <ConnectedStatus />
    </div>
  );
};

export default App;
