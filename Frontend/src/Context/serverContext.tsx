import React, { createContext, useState, useEffect } from 'react';

export const socket = new WebSocket("ws://127.0.0.1:5000/");
socket.onopen = () => console.log('connected to server')
socket.onclose = () => console.log('disconnected from server')

interface Icontext {
  uid: string | undefined,
  displayName: string | undefined,
  opponentName: string | undefined,
  gid: number | undefined,
  readyToStart: boolean,
  players: []
}

const initialState: Icontext = {
  uid: undefined,
  displayName: undefined,
  opponentName: undefined,
  gid: undefined,
  readyToStart: false,
  players: []
}

export const ServerContext = createContext<Icontext | any>(initialState)

export const ServerProvider = (props: any) => {
  
  const [cState, setCState] = useState(initialState)

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data)
    if (response.method === 'connected') setCState({...cState, uid: response.uid });
    if (response.method === 'create-game') setCState({...cState, gid: response.gid });
    if (response.method === 'joined-game') {
      console.log(response)

    }
    

    
  // const beginGame = (response) => {
  //   createdGame.style.display = 'none';
  //   console.log(response);
  //   const playerOneName = response.players['player-one'].name;
  //   const playerTwoName = response.players['player-two'].name;
  //   if (response.uids[0] === user.uid) gameDisplay.innerHTML += `<p>${playerTwoName} has joined</p>`;
  //   gameDisplay.innerHTML += `<p>Welcome ${playerOneName} and ${playerTwoName}</p>`;
  // }


  }

  return <ServerContext.Provider value={{cState, setCState}}>{props.children}</ServerContext.Provider>

}