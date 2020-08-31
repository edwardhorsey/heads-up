import React, { useState } from 'react';
import styles from './App.module.scss';

import SetName from './Components/SetName';
import Lobby from './Components/Lobby';

function App() {
  const [ displayName, setDisplayName ] = useState('')
  
  const setName = (name: string): void => {
    setDisplayName(name);
  };

  const showLobby = () => {
    return displayName === '' ? (<SetName setName={setName} />) : (<Lobby displayName={displayName} />)
  }

  return (
    <div className={styles.App}>
      <h1>Heads Up Poker</h1>
      {showLobby()}
    </div>
  );
}

export default App;
