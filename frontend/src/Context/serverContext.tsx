import React, { createContext, useReducer, useContext } from 'react';
import { useAuth } from "./authContext";
import socket from '../Socket/socket';
import { ServerState, ServerProviderProps, ServerReducerAction, initialServerState, IServerContext, initialServerContext } from '../Interfaces/interfaces';

const serverReducer = (serverState: ServerState, action: ServerReducerAction):  ServerState => {
  switch(action.type) {
    case 'socketOnOpen':
      return { ...serverState, status: "connected" };
  
    case 'socketOnClose':
      return { ...serverState, status: "disconnected" };
  
    case 'socketOnError':
      return { ...serverState, status: "error" };

    case 'resetServer':
      return { ...initialServerState };

    case 'connected':
      return { ...serverState, uid: action.payload.uid };

    case 'createGame':
      return { ...serverState, gid: action.payload.gid };

    case 'removeGid':
      return { ...serverState, gid: '' };

    case 'incorrectGid':
      return { ...serverState, falseGID: true };

    case 'validGid':
      return {...serverState, falseGID: false };

    case 'joinGame':
      let whichPlayer: number|null = null;

      if (serverState.uid === action.payload.players[0].uid) {
        whichPlayer = 0;
      } else if (serverState.uid === action.payload.players[1].uid) {
        whichPlayer = 1;
      } else {
        throw new Error(
          `Action joinGame: client uid ${serverState.uid} does not match
          that inside Game (gid: ${action.payload.gid}) - player uids: 
          ${action.payload.players[0].uid} ${action.payload.players[1].uid}`
        );
      }

      return { ...serverState,
        gid: action.payload.gid,
        falseGID: false,
        players: action.payload.players,
        readyToStart: action.payload.players.length === 2 ? true : false,
        whichPlayer: whichPlayer,
      };

    case 'onePlayerReady':
      return {...serverState,
        players: serverState.players.map((player, index) => (
          {...player, ready: action.payload.players[index].ready}
        ))
      };

    case 'newHand':
      return {...serverState,
          players: action.payload.players,
          action: action.payload.action === 'two' ? 1: 0,
          stage: action.payload.stage,
          yourHand: action.payload.players[serverState.whichPlayer].hand,
          oppHand: action.payload.players[serverState.whichPlayer === 0 ? 1: 0].hand,
          community: action.payload['community-cards'],
          pot: action.payload.pot,
          noOfHands: action.payload['number-of-hands'],
          winner: action.payload.winner,
          winningHand: action.payload['winning-hand']
        };

    case 'allIn':
      return {...serverState,
        players: serverState.players.map((player, index) => (
          {...player, ...action.payload.players[index]}
        )),
        stage: 'to-call',
        action: action.payload.action === 'two' ? 1: 0,
        pot: action.payload.pot
      };

    case 'showdown':
      return {...serverState,
        players: serverState.players.map((player, index) => (
          {...player, ...action.payload.players[index]}
        )),
        yourHand: action.payload.players[serverState.whichPlayer].hand,
        oppHand: action.payload.players[serverState.whichPlayer === 0 ? 1: 0].hand,
        community: action.payload['community-cards'],
        stage: 'showdown',
        action: null,
        pot: action.payload.pot
      };

    case 'folded':
      return {...serverState,
        players: serverState.players.map((player, index) => (
          {...player, ...action.payload.players[index]}
        )),
        stage: 'folded',
        action: null,
      };

    case 'winner':
      return {...serverState,
        players: serverState.players.map((player, index) => (
          {...player, ...action.payload.players[index]}
        )),
        pot: action.payload.pot,
        winner: action.payload.winner,
        action: null,
        winningHand: action.payload['winning-hand'],
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
          {...player, ...action.payload.players[index]}
        )),
        yourHand: action.payload.players[serverState.whichPlayer].hand,
        oppHand: action.payload.players[serverState.whichPlayer === 0 ? 1: 0].hand,
        noOfRounds: action.payload['number-of-rounds'],
        stage: action.payload['stage'],
        inHand: false
      };

    default: {
      throw new Error(`Action - ${action.type} - not matched`);
    }
  } 
};

const ServerContext = createContext<IServerContext>(initialServerContext);

export const ServerProvider = (props: ServerProviderProps): JSX.Element => {
  const [serverState, serverDispatch] = useReducer(serverReducer, initialServerState);
  const { authDispatch, login } = useAuth();

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
    console.log('Data arrived! ', response);

    /* TEMP Special scenarios */
    switch (method) {
      case 'login':
        serverDispatch({ type: 'connected', payload: response });
        login(response);
        break;

      case 'forceLogout':
        authDispatch({ type: method, message: response.message });
        break;

      case 'newHand':
        serverState.noOfHands < 1
          ? serverDispatch({ type: method, payload: response })
          : setTimeout(() => serverDispatch({ type: method, payload: response }), 3000);
        break;

      default:
        serverDispatch({ type: method, payload: response });
    }
  }
  
  return <ServerContext.Provider value={{ serverState, serverDispatch }}>{props.children}</ServerContext.Provider>
};

export const useServer = (): IServerContext => useContext(ServerContext);