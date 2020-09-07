import React, { createContext, useState, useEffect } from 'react';

export const socket = new WebSocket("ws://127.0.0.1:5000/");
socket.onopen = () => console.log('connected to server')
socket.onclose = () => console.log('disconnected from server')

interface Icontext {
  uid: string | undefined,
  displayName: string | undefined,
  opponentName: string | undefined,
  gid: number | undefined,
  falseGID: boolean
  readyToStart: boolean,
  players: [],
  whichPlayer: number,
  hand: string[] | boolean,
  pot: number
}

const initialState: Icontext = {
  uid: undefined,
  displayName: undefined,
  opponentName: undefined,
  gid: undefined,
  falseGID: false,
  readyToStart: false,
  players: [],
  whichPlayer: 0,
  hand: false,
  pot: 0
}

export const ServerContext = createContext<Icontext | any>(initialState)

export const ServerProvider = (props: any) => {
  
  const [cState, setCState] = useState(initialState)

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data)
    if (response.method === 'connected') setCState({...cState, uid: response.uid });
    if (response.method === 'create-game') setCState({...cState, gid: response.gid });
    if (response.method === 'incorrect-gid') {
      console.log(response)
      setCState({...cState, falseGID: true });
    }
    if (response.method === 'joined-game') {
      setCState({ ...cState,
        gid: response.gid,
        falseGID: false,
        players: response.players,
        readyToStart: response.players.length === 2 ? true : false,
        whichPlayer: cState.uid === response.players[0].uid ? 0 : 1
      })
    }
    if (response.method === 'one-player-ready') {
      console.log(response);
      setCState({...cState,
        players: response.players
      })
    }
    if (response.method === 'new-hand') {
      console.log(response);
      setCState({...cState,
        players: response.players,
        hand: response.players[cState.whichPlayer].hand,
        pot: response.pot
      })
    }
  }

  return <ServerContext.Provider value={{cState, setCState}}>{props.children}</ServerContext.Provider>

}