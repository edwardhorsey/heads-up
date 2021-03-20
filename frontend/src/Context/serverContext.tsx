import React, { ReactNode, createContext, useReducer, useContext } from 'react';
import { useAuth } from "./authContext";
import socket from '../Socket/socket';
import { ServerState, Action, initialServerState, IServerContext, initialServerContext } from '../Interfaces/interfaces';

const serverReducer = (serverState: ServerState, action: Action):  ServerState => {
  const { type, payload: response } = action;

  switch(type) {
    case 'socketOnOpen':
      return { ...serverState, status: "connected" };
  
    case 'socketOnClose':
      return { ...serverState, status: "disconnected" };
  
    case 'socketOnError':
      return { ...serverState, status: "error" };

    case 'resetServer':
      return { ...initialServerState };

    case 'connected':
      return { ...serverState, uid: response.uid };

    case 'setUsername':
      return { ...serverState, displayName: response.username, uid: response.uid };

    case 'createGame':
      return { ...serverState, gid: response.gid };

    case 'removeGid':
      return { ...serverState, gid: '' };

    case 'incorrectGid':
      return { ...serverState, falseGID: true };

    case 'validGid':
      return {...serverState, falseGID: false };

    case 'joinGame':
      const whichPlayer = serverState.uid === response.players[0].uid ? 0 : 1;
      console.log(whichPlayer);
      return { ...serverState,
        gid: response.gid,
        falseGID: false,
        players: response.players,
        readyToStart: response.players.length === 2 ? true : false,
        whichPlayer: serverState.uid === response.players[0].uid ? 0 : 1
      };

    case 'onePlayerReady':
      return {...serverState,
        players: serverState.players.map((player, index) => (
          {...player, ready: response.players[index].ready}
        ))
      };

    case 'newHand':
      return {...serverState,
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
        };

    case 'allIn':
      return {...serverState,
        players: serverState.players.map((player, index) => (
          {...player, ...response.players[index]}
        )),
        stage: 'to-call',
        action: response.action === 'two' ? 1: 0,
        pot: response.pot
      };

    case 'showdown':
      return {...serverState,
        players: serverState.players.map((player, index) => (
          {...player, ...response.players[index]}
        )),
        yourHand: response.players[serverState.whichPlayer].hand,
        oppHand: response.players[serverState.whichPlayer === 0 ? 1: 0].hand,
        community: response['community-cards'],
        stage: 'showdown',
        action: null,
        pot: response.pot
      };

    case 'folded':
      return {...serverState,
        players: serverState.players.map((player, index) => (
          {...player, ...response.players[index]}
        )),
        stage: 'folded',
        action: null,
      };

    case 'winner':
      return {...serverState,
        players: serverState.players.map((player, index) => (
          {...player, ...response.players[index]}
        )),
        pot: response.pot,
        winner: response.winner,
        action: null,
        winningHand: response['winning-hand'],
        stage: 'winner'
      };

    case 'playerBust':
      return {...serverState,
        action: null,
        stage: 'end'
      };

    case 'backToLobby':  
      return {...serverState,
        players: serverState.players.map((player, index) => (
          {...player, ...response.players[index]}
        )),
        yourHand: response.players[serverState.whichPlayer].hand,
        oppHand: response.players[serverState.whichPlayer === 0 ? 1: 0].hand,
        noOfRounds: response['number-of-rounds'],
        stage: response['stage'],
        inHand: false
      };

    default: {
      throw new Error(`Action - ${type} - not matched`);
    }
  } 
};

interface ServerProviderProps {
  children: ReactNode;
}

const ServerContext = createContext<IServerContext>(initialServerContext);

export const ServerProvider = (props: ServerProviderProps) => {
  const [serverState, serverDispatch] = useReducer(serverReducer, initialServerState);
  const { login } = useAuth();

  socket.onopen = () => {
    serverDispatch({ type: 'socketOnOpen' });
  };

  socket.onclose = () => {
    serverDispatch({ type: 'socketOnClose' })
  };

  socket.onerror = (event) => {
    console.error("WebSocket error observed:", event);
    serverDispatch({ type: 'socketOnError' })
  };

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data);
    const { method } = response;

    /* TEMP Special scenarios */
    switch (method) {
      case 'setUsername':
        login();
        serverDispatch({ type: method, payload: response });
        break;

      case 'newHand':
        serverState.noOfHands < 1
          ? serverDispatch({ type: method, payload: response })
          : setTimeout(() => serverDispatch({ type: method, payload: response }), 3000);
        break;

      case 'backToLobby':
        setTimeout(() => serverDispatch({ type: method, payload: response }), 2000);
        break;

      default:
        serverDispatch({ type: method, payload: response });
    }
  }
  
  return <ServerContext.Provider value={{ serverState, serverDispatch }}>{props.children}</ServerContext.Provider>
};

export const useServer = () => useContext(ServerContext);