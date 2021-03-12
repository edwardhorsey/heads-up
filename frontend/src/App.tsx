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
  const { authState } = auth;

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

  const showLobby = () => !displayName ? <SetName setName={setName} /> : beginGame();

  const beginGame = () => readyToStart ? <GameContainer /> : <Lobby />;
  
  return (
      <div className={styles.App}>
        <h1>Heads Up Poker</h1>
          {authState.authToken ? (
            <Switch>
              <Route path="/">
                {showLobby()}
                <Link to="/home">home</Link>
              </Route>
              <Route path="/home">{showLobby()}</Route>
            </Switch>
          ) : (
            <Route exact path="/"><Login /></Route>
          )}
        <ConnectedStatus />
      </div>
  );
}

export default App;