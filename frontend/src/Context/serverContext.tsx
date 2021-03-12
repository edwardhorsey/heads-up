import React, { ReactChild, createContext, useState } from 'react';
import socket from '../Socket/socket';
import { initialServerState, IServerContext, initialServerContext } from './interfaces';

interface Iprops {
  children: ReactChild
}

export const ServerContext = createContext<IServerContext>(initialServerContext)

export const ServerProvider = (props: Iprops) => {
  const [serverState, setServerState] = useState(initialServerState)

  socket.onopen = () => {
    console.log("connected to server");
    setServerState({ ...serverState, status: "connected" });
  };

  socket.onclose = () => {
    console.log("disconnected from server");
    setServerState({ ...serverState, status: "disconnected" });
  };

  socket.onerror = (event) => {
    console.log("WebSocket error observed:", event);
    setServerState({ ...serverState, status: "error" });
  };

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data);
    console.log('new data arrived');
    console.table(response);

    if (response.method === 'connected') setServerState({ ...serverState, uid: response.uid })

    if (response.method === 'createGame') setServerState({ ...serverState, gid: response.gid })

    if (response.method === 'incorrectGid') setServerState({ ...serverState, falseGID: true });

    if (response.method === 'joinGame') {
      setServerState({ ...serverState,
        gid: response.gid,
        falseGID: false,
        players: response.players,
        readyToStart: response.players.length === 2 ? true : false,
        whichPlayer: serverState.uid === response.players[0].uid ? 0 : 1
      })
    }

    if (response.method === 'onePlayerReady') {
      setServerState({...serverState,
        players: serverState.players.map((player, index) => {
          return {...player, ready: response.players[index].ready}
        })
      })
    }

    if (response.method === 'newHand') {
      const newHand = () => {
        setServerState({...serverState,
          players: response.players,
          action: response.action === 'two' ? 1: 0,
          stage: response.stage,
          yourHand: response.players[serverState.whichPlayer].hand,
          oppHand: response.players[serverState.whichPlayer === 0 ? 1: 0].hand,
          community: response['community-cards'],
          pot: response.pot,
          noOfHands: response['number-of-hands'],
          winner: response.winner,
          winningHand: response['winning-hand']
        })
      }

      serverState.noOfHands < 1 ? newHand() : setTimeout(()=>{newHand()}, 3000)
    }

    if (response.method === "allIn") {
      setServerState({...serverState,
        players: serverState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        stage: 'to-call',
        action: response.action === 'two' ? 1: 0,
        pot: response.pot
      })
    }

    if (response.method === "showdown") {
      setServerState({...serverState,
        players: serverState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        yourHand: response.players[serverState.whichPlayer].hand,
        oppHand: response.players[serverState.whichPlayer === 0 ? 1: 0].hand,
        community: response['community-cards'],
        stage: 'showdown',
        action: null,
        pot: response.pot
      })
    }

    if (response.method === "folded") {
      setServerState({...serverState,
        players: serverState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        stage: 'folded',
        action: null,
      })
    }

    if (response.method === "winner") {
      setServerState({...serverState,
        players: serverState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        pot: response.pot,
        winner: response.winner,
        action: null,
        winningHand: response['winning-hand'],
        stage: 'winner'
      })
    }

    if (response.method === "playerBust") {
      setTimeout(()=>{
        setServerState({...serverState,
          action: null,
          stage: 'end'
        })
      }, 2000)
    }

    if (response.method === "backToLobby") {
      console.log(response.players[serverState.whichPlayer].hand);

      setServerState({...serverState,
        players: serverState.players.map((player, index) => {
          return {...player, ...response.players[index]}
        }),
        yourHand: response.players[serverState.whichPlayer].hand,
        oppHand: response.players[serverState.whichPlayer === 0 ? 1: 0].hand,
        noOfRounds: response['number-of-rounds'],
        stage: response['stage'],
        inHand: false
      })
    }
  }
  return <ServerContext.Provider value={{ serverState, setServerState}}>{props.children}</ServerContext.Provider>
};