import React, { useState, useContext } from 'react';
import styles from './App.module.scss';

import SetName from './Components/SetName';
import Lobby from './Components/Lobby';
import { ServerContext } from './Context/serverContext';

const App = () => {
  const [ displayName, setDisplayName ] = useState('');
  
  const context = useContext(ServerContext)
  console.log('hi from app', context)
  
  const setName = (name: string): void => {
    setDisplayName(name);
    context.setCState({...context.cState, displayName: name})
  };

  const showLobby = () => {
    return displayName === '' ? (<SetName setName={setName} />) : (<Lobby />)
  }

  return (
      <div className={styles.App}>
        <h1>Heads Up Poker</h1>
        {showLobby()}
      </div>
  );
}

export default App;
