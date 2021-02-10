import React, { useState, useContext } from 'react';
import styles from './App.module.scss';
import SetName from './Components/SetName';
import Lobby from './Components/Lobby';
import { ServerContext } from './Context/serverContext';
import GameContainer from './Components/GameContainer';
import ConnectedStatus from './Components/ConnectedStatus';

const App = () => {
  const [ displayName, setDisplayName ] = useState('');
  
  const context = useContext(ServerContext);
  const { setCState, inHand, readyToStart } = context;
  const setName = (name: string): void => {
    console.log('run')
    setDisplayName(name);
    setCState({...context, displayName: name})
  };

  const showLobby = () => !displayName ? <SetName setName={setName} /> : beginGame();

  const beginGame = () => readyToStart ? <GameContainer /> : <Lobby />;
  
  return (
      <div className={styles.App}>
        {!inHand ? <h1>Heads Up Poker</h1> : '' }
        {showLobby()}
        <ConnectedStatus />
      </div>
  );
}

export default App;