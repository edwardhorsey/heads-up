import React, { createContext, useState } from 'react';
import socket from '../Socket/socket';
import { Icontext, initialState, iProps } from './interfaces';

export const ServerContext = createContext<Icontext>(initialState)

export const ServerProvider = (props: iProps) => {
  const [cState, setCState] = useState(initialState)

  socket.onopen = () => {
    console.log("connected to server");
    setCState({ ...cState, status: "connected" });
  };

  socket.onclose = () => {
    console.log("disconnected from server");
    setCState({ ...cState, status: "disconnected" });
  };

  socket.onerror = (event) => {
    console.log("WebSocket error observed:", event);
    setCState({ ...cState, status: "error" });
  };

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data);
    console.log('new data arrived');
    console.table(response);
    if (response.method === 'connected') setCState({...cState, uid: response.uid });

    if (response.method === 'createGame') setCState({...cState, gid: response.gid });

    if (response.method === 'incorrect-gid') setCState({...cState, falseGID: true });

    if (response.method === 'joinGame') {
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
        players: cState.players.map((player, index) => {
          return {...player, ready: response.players[index].ready}
        })
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
        action: null,
        pot: response.pot
      })
    }

    if (response.method === "folded") {
      setCState({...cState,
        players: cState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        stage: 'folded',
        action: null,
      })
    }

    if (response.method === "winner") {
      setCState({...cState,
        players: cState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        pot: response.pot,
        winner: response.winner,
        action: null,
        winningHand: response['winning-hand'],
        stage: 'winner'
      })
    }

    if (response.method === "player-bust") {
      setTimeout(()=>{
        setCState({...cState,
          action: null,
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
        stage: response['stage'],
        inHand: false
      })
    }
  }
  return <ServerContext.Provider value={{...cState, setCState}}>{props.children}</ServerContext.Provider>
};