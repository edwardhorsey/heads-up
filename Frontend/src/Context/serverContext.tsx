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
  action: number | null,
  stage: string,
  players: object[],
  whichPlayer: number,
  oppHand: string[] | boolean,
  yourHand: string[] | boolean,
  community: string[] | boolean,
  pot: number
}

const initialState: Icontext = {
  uid: undefined,
  displayName: undefined,
  opponentName: undefined,
  gid: undefined,
  falseGID: false,
  readyToStart: false,
  action: null,
  stage: 'initial',
  players: [],
  whichPlayer: 0,
  oppHand: false,
  yourHand: false,
  community: false,
  pot: 0
}

export const ServerContext = createContext<Icontext | any>(initialState)

export const ServerProvider = (props: any) => {
  
  const [cState, setCState] = useState(initialState)

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data)
    if (response.method === 'connected') setCState({...cState, uid: response.uid });
    if (response.method === 'create-game') setCState({...cState, gid: response.gid });
    if (response.method === 'incorrect-gid') setCState({...cState, falseGID: true });
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
      setCState({...cState,
        players: response.players
      })
    }
    if (response.method === 'new-hand') {
      setCState({...cState,
        players: cState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        action: response.action === 'two' ? 1: 0,
        stage: response.stage,
        yourHand: response.players[cState.whichPlayer].hand,
        oppHand: response.players[cState.whichPlayer === 0 ? 1: 0].hand,
        pot: response.pot
      })
    }
    if (response.method === "all-in") {
      console.log(response)
      setCState({...cState,
        players: cState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        stage: 'to-call',
        action: response.action === 'two' ? 1: 0,
        pot: response.pot
      })
    }
    if (response.method === "showdown") {
      console.log(response)
      setCState({...cState,
        players: cState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        yourHand: response.players[cState.whichPlayer].hand,
        oppHand: response.players[cState.whichPlayer === 0 ? 1: 0].hand,
        community: response['community-cards'],
        stage: 'showdown',
      })
    }
    if (response.method === "folded") {
      console.log(response)
      setCState({...cState,
        players: cState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        stage: 'folded',
      })
    }
    if (response.method === "winner") {
      console.log(response)
      setCState({...cState,
        players: cState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        stage: 'winner'
      })
    }

  }

  return <ServerContext.Provider value={{cState, setCState}}>{props.children}</ServerContext.Provider>

}