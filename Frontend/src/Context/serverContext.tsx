import React, { createContext, useState, Dispatch, SetStateAction, ReactChild } from 'react';
import socket from '../Socket/socket';

interface iProps {
  children: ReactChild
}

export interface Iplayer {
  uid: string,
  name: string,
  bankroll: number,
  ready: boolean,
  'bet-size': number,
  folded: boolean,
  blind: number,
  'rounds-won': number,
  profit: number
}

const initialPlayer: Iplayer = {
  uid: '',
  name: '',
  bankroll: 0,
  ready: false,
  'bet-size': 0,
  folded: false,
  blind: 0,
  'rounds-won': 0,
  profit: 0
}

interface Icontext {
  uid: string,
  displayName: string,
  opponentName: string,
  gid: number,
  falseGID: boolean
  readyToStart: boolean,
  action: number | null,
  stage: string,
  players: Array<Iplayer>,
  whichPlayer: number,
  oppHand: string[],
  yourHand: string[],
  community: string[],
  winningHand: [string, number[], string[]],
  winner: string,
  pot: number,
  noOfHands: number,
  noOfRounds: number,
  setCState: Dispatch<SetStateAction<Icontext>>
}

const initialState: Icontext = {
  uid: '',
  displayName: '',
  opponentName: '',
  gid: 0,
  falseGID: false,
  readyToStart: false,
  action: null,
  stage: 'initial',
  players: [initialPlayer, initialPlayer],
  whichPlayer: 0,
  oppHand: [],
  yourHand: [],
  community: [],
  winningHand: ['', [], []],
  winner: '',
  pot: 0,
  noOfHands: 0,
  noOfRounds: 0,
  setCState: ()=>{}
}

export const ServerContext = createContext<Icontext>(initialState)

export const ServerProvider = (props: iProps) => {
  const [cState, setCState] = useState(initialState)

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data)
    console.log(response)
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
        players: response.players,
        noOfHands: response['number-of-hands']
      })
    }
    if (response.method === 'new-hand') {
      const newHand = () => {
        setCState({...cState,
          players: response.players,
          action: response.action === 'two' ? 1: 0,
          stage: response.stage,
          yourHand: response.players[cState.whichPlayer].hand,
          oppHand: response.players[cState.whichPlayer === 0 ? 1: 0].hand,
          community: response['community-cards'],
          pot: response.pot,
          noOfHands: response['number-of-hands'],
          winner: response.winner,
          winningHand: response['winning-hand']
        })
      }
      cState.noOfHands < 1 ? newHand() : setTimeout(()=>{newHand()}, 2000)
    }
    if (response.method === "all-in") {
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
      setCState({...cState,
        players: cState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        yourHand: response.players[cState.whichPlayer].hand,
        oppHand: response.players[cState.whichPlayer === 0 ? 1: 0].hand,
        community: response['community-cards'],
        stage: 'showdown',
        pot: response.pot
      })
    }
    if (response.method === "folded") {
      setCState({...cState,
        players: cState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        stage: 'folded',
      })
    }
    if (response.method === "winner") {
      setCState({...cState,
        players: cState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        pot: response.pot,
        winner: response.winner,
        winningHand: response['winning-hand'],
        stage: 'winner'
      })
    }
    if (response.method === "player-bust") {
      setTimeout(()=>{
        setCState({...cState,
          stage: 'end'
        })
      }, 2000)
    }
    if (response.method === "back-to-lobby") {
      setCState({...cState,
        players: cState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        yourHand: response.players[cState.whichPlayer].hand,
        oppHand: response.players[cState.whichPlayer === 0 ? 1: 0].hand,
        noOfRounds: response['number-of-rounds'],
        noOfHands: response['number-of-hands'],
      })
    }
  }
  return <ServerContext.Provider value={{...cState, setCState}}>{props.children}</ServerContext.Provider>
};