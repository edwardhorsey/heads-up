import React, { useState, useContext } from 'react';
import styles from './App.module.scss';

import SetName from './Components/SetName';
import Lobby from './Components/Lobby';
import { ServerContext } from './Context/serverContext';
import GameContainer from './Components/GameContainer';

const App = () => {
  const [ displayName, setDisplayName ] = useState('');
  
  const context = useContext(ServerContext)
  console.log('hi from app', context)
  
  const { readyToStart } = context.cState;
  const setName = (name: string): void => {
    console.log('insdie setname func', name)
    setDisplayName(name);
    context.setCState({...context.cState, displayName: name})
  };

  const showLobby = () => displayName === '' ? <SetName setName={setName} /> : beginGame();

  const beginGame = () => readyToStart ? <GameContainer /> : <Lobby />;

  return (
      <div className={styles.App}>
        <h1>Heads Up Poker</h1>
        {showLobby()}
      </div>
  );
}

export default App;
