import React, { useState, useContext } from 'react';
import styles from './App.module.scss';
import SetName from './Components/SetName';
import Lobby from './Components/Lobby';
import { ServerContext } from './Context/serverContext';
import GameContainer from './Components/GameContainer';
import ConnectedStatus from './Components/ConnectedStatus';
import socket from './Socket/socket';
import { AuthContext } from "./Context/authContext";
import Login from './Components/Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Button from './Components/Button';

const App = () => {
  const [ displayName, setDisplayName ] = useState('');
  
  const server = useContext(ServerContext);
  const { setServerState, serverState } = server;
  const { readyToStart } = serverState;

  const auth = useContext(AuthContext);
  const { authState, logout } = auth;

  const setName = (name: string): void => {
      setDisplayName(name);
      setUsername(name);
      setServerState({...serverState, displayName: name});
    };

  const setUsername = (username: string) => {
    const request = {
      username,
      action: 'onGameAction',
      method: 'setUsername',
    };

    socket.send(JSON.stringify(request));
  }

  const beginGame = () => readyToStart ? <GameContainer /> : <Lobby />;
  
  return (
      <div className={styles.App}>
        <Route path="/">
          {authState.authToken ? (
            <Switch>
              <Route exact path="/">
                <h1>Heads Up Poker</h1>
                <Button logic={logout} text="Logout" />
                <Link to="/display-name">Set display name</Link>
                {beginGame()}
              </Route>
              <Route exact path="/display-name">
                <Link to="/">Home</Link>
                <SetName setName={setName} />
              </Route>
            </Switch>
          ) : (
            <Login />
          )}
        </Route>
        <ConnectedStatus />
      </div>
  );
}

export default App;