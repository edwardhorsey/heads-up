import React, { useState, useContext } from 'react';
import styles from './App.module.scss';
import SetName from './Components/SetName';
import Lobby from './Components/Lobby';
import { ServerContext } from './Context/serverContext';
import GameContainer from './Components/GameContainer';
import ChipsGen from './Components/ChipsGen';
import RoundWinner from './Components/RoundWinner';

const App = () => {
  const [ displayName, setDisplayName ] = useState('');
  
  const context = useContext(ServerContext);
  const { setCState, noOfHands } = context;
  console.log(context)
  
  const { readyToStart } = context;
  const setName = (name: string): void => {
    setDisplayName(name);
    setCState({...context, displayName: name})
  };

  const showLobby = () => !displayName ? <SetName setName={setName} /> : beginGame();

  const beginGame = () => readyToStart ? <GameContainer /> : <Lobby />;
  
  return (
      <div className={styles.App}>
        {!noOfHands ? <h1>Heads Up Poker</h1> : '' }
        {showLobby()}
      </div>
  );
}

export default App;