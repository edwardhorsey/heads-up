import React, { useState, useContext } from 'react';
import styles from './App.module.scss';
import SetName from './Components/SetName';
import Lobby from './Components/Lobby';
import { ServerContext } from './Context/serverContext';
import GameContainer from './Components/GameContainer';


/////////////////////////////////////
import PlayingCard from "./Components/PlayingCard";
import CommunityCards from "./Components/CommunityCards";
/////////////////////////////////////


const App = () => {
  const [ displayName, setDisplayName ] = useState('');
  
  const context = useContext(ServerContext);
  const { setCState } = context;
  
  const { readyToStart } = context;
  const setName = (name: string): void => {
    setDisplayName(name);
    setCState({...context, displayName: name})
  };

  const showLobby = () => !displayName ? <SetName setName={setName} /> : beginGame();

  const beginGame = () => readyToStart ? <GameContainer /> : <Lobby />;
  
  /////////////////////////////////////

  const readCards = (hand: string[][]) => hand.map((card, index) => <PlayingCard
  key={index}
  winner={false}
  card={card}
  />);





  /////////////////////////////////////

  return (
      <div className={styles.App}>
        <h1>Heads Up Poker</h1>
        {/* {showLobby()} */}
        <CommunityCards cards={readCards([["3", "diamonds"],["5", "clubs"],["q", "hearts"],["a", "clubs"],["j", "diamonds"]])} />
      </div>
  );
}

export default App;
