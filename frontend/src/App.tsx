import React, { useState, useContext } from 'react';
import styles from './App.module.scss';
import SetName from './Components/SetName';
import Lobby from './Components/Lobby';
import { ServerContext } from './Context/serverContext';
import GameContainer from './Components/GameContainer';
import ConnectedStatus from './Components/ConnectedStatus';
import socket from './Socket/socket';

const App = () => {
  const [ displayName, setDisplayName ] = useState('');
  
  const context = useContext(ServerContext);
  const { setCState, inHand, readyToStart } = context;
  const setName = (name: string): void => {
    setDisplayName(name);
    setUsername(name);
    setCState({...context, displayName: name})
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
        {showLobby()}
        <ConnectedStatus />
      </div>
  );
}

export default App;