import React, { createContext, useReducer, useContext } from 'react';
import { useAuth } from './authContext';
import socket from '../Socket/socket';
import {
  GameState,
  GameReducerAction,
  initialGameState,
  initialServerContext,
  initialServerState,
  Iplayer,
  IServerContext,
  ServerProviderProps,
  ServerReducerAction,
  ServerState,
  authReducerActions,
  serverReducerActions,
  gameReducerActions,
} from '../Interfaces/interfaces';

const calculateWhichPlayer = (
  uid: string,
  players: Iplayer[],
  gid: string,
): number => {
  if (uid === players[0].uid) {
    return 0;
  }
  if (uid === players[1].uid) {
    return 1;
  }

  throw new Error(
    `Action joinGame: client uid ${uid} does not match
    that inside Game (gid: ${gid}) - player uids: 
    ${players[0].uid} ${players[1].uid}`,
  );
};

const serverReducer = (
  serverState: ServerState,
  action: ServerReducerAction,
): ServerState => {
  switch (action.type) {
    case 'socketOnOpen':
      return { ...serverState, status: 'connected' };

    case 'socketOnClose':
      return { ...serverState, status: 'disconnected' };

    case 'socketOnError':
      return { ...serverState, status: 'error' };

    case 'resetServer':
      return { ...initialServerState };

    case 'connected':
      return { ...serverState, uid: action.payload.uid };

    default: {
      throw new Error(`Action - ${action} - not matched`);
    }
  }
};

const gameReducer = (
  gameState: GameState,
  action: GameReducerAction,
): GameState => {
  switch (action.type) {
    case 'createGame':
      return { ...gameState, gid: action.payload.gid };

    case 'removeGid':
      return { ...gameState, gid: '' };

    case 'incorrectGid':
      return { ...gameState, falseGID: true };

    case 'validGid':
      return { ...gameState, falseGID: false };

    case 'joinGame':
      return {
        ...gameState,
        gid: action.payload.gid,
        falseGID: false,
        players: action.payload.players,
        gameHasEnoughPlayers: action.payload.players.length === 2,
        whichPlayer: action.payload.whichPlayer,
      };

    case 'addChips':
      return {
        ...gameState,
        players: action.payload.players,
      };

    case 'onePlayerReady':
      return {
        ...gameState,
        players: gameState.players.map((player, index) => (
          { ...player, ...action.payload.players[index] }
        )),
      };

    case 'newHand':
      return {
        ...gameState,
        players: action.payload.players,
        action: action.payload.action === 'two' ? 1 : 0,
        stage: action.payload.stage,
        yourHand: action.payload.players[gameState.whichPlayer].hand,
        oppHand: (
          action.payload.players[gameState.whichPlayer === 0 ? 1 : 0].hand
        ),
        community: action.payload['community-cards'],
        pot: action.payload.pot,
        noOfHands: action.payload['number-of-hands'],
        winner: action.payload.winner,
        winningHand: action.payload['winning-hand'],
      };

    case 'allIn':
      return {
        ...gameState,
        players: gameState.players.map((player, index) => (
          { ...player, ...action.payload.players[index] }
        )),
        stage: 'to-call',
        action: action.payload.action === 'two' ? 1 : 0,
        pot: action.payload.pot,
      };

    case 'showdown':
      return {
        ...gameState,
        players: gameState.players.map((player, index) => (
          { ...player, ...action.payload.players[index] }
        )),
        yourHand: action.payload.players[gameState.whichPlayer].hand,
        oppHand: (
          action.payload.players[gameState.whichPlayer === 0 ? 1 : 0].hand
        ),
        community: action.payload['community-cards'],
        stage: 'showdown',
        action: null,
        pot: action.payload.pot,
      };

    case 'folded':
      return {
        ...gameState,
        players: gameState.players.map((player, index) => (
          { ...player, ...action.payload.players[index] }
        )),
        stage: 'folded',
        action: null,
      };

    case 'winner':
      return {
        ...gameState,
        players: gameState.players.map((player, index) => (
          { ...player, ...action.payload.players[index] }
        )),
        pot: action.payload.pot,
        winner: action.payload.winner,
        action: null,
        winningHand: action.payload['winning-hand'],
        stage: 'winner',
      };

    case 'playerBust':
      return {
        ...gameState,
        action: null,
        stage: 'end',
      };

    case 'backToLobby':
      return {
        ...gameState,
        players: gameState.players.map((player, index) => (
          { ...player, ...action.payload.players[index] }
        )),
        yourHand: action.payload.players[gameState.whichPlayer].hand,
        oppHand: (
          action.payload.players[gameState.whichPlayer === 0 ? 1 : 0].hand
        ),
        noOfRounds: action.payload['number-of-rounds'],
        stage: action.payload.stage,
        inHand: false,
      };

    default: {
      throw new Error(`Action - ${action.type} - not matched`);
    }
  }
};

const ServerContext = createContext<IServerContext>(initialServerContext);

export const ServerProvider = (props: ServerProviderProps): JSX.Element => {
  const [serverState, serverDispatch] = useReducer(
    serverReducer, initialServerState,
  );

  const [gameState, gameDispatch] = useReducer(
    gameReducer, initialGameState,
  );

  const { authDispatch, login } = useAuth();

  socket.onopen = () => {
    serverDispatch({ type: 'socketOnOpen' });
  };

  socket.onclose = () => {
    serverDispatch({ type: 'socketOnClose' });
  };

  socket.onerror = (event) => {
    console.error('WebSocket error observed:', event);
    serverDispatch({ type: 'socketOnError' });
  };

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data);
    const { method } = response;

    if (process.env.REACT_APP_STAGE === 'dev') {
      console.log('Data arrived! ', response);
    }

    /* TEMP Special scenarios */
    if (serverReducerActions.includes(method)) {
      serverDispatch({ type: method, payload: response });
    } else if (gameReducerActions.includes(method)) {
      switch (method) {
        case 'joinGame':
          gameDispatch({
            type: method,
            payload: {
              ...response,
              whichPlayer: calculateWhichPlayer(
                serverState.uid,
                response.players,
                response.gid,
              ),
            },
          });
          break;

        case 'addChips':
          if (response.userBankroll !== false) {
            authDispatch({ type: method, bankroll: response.userBankroll });
          }

          gameDispatch({ type: method, payload: response });
          break;

        case 'newHand':
          if (gameState.noOfHands < 1 || gameState.stage === 'backToLobby') {
            gameDispatch({ type: method, payload: response });
          } else {
            setTimeout(
              () => gameDispatch({ type: method, payload: response }),
              2000,
            );
          }
          break;

        default:
          gameDispatch({ type: method, payload: response });
      }
    } else if (authReducerActions.includes(method)) {
      switch (method) {
        case 'login':
          serverDispatch({ type: 'connected', payload: response });
          login(response);
          break;

        case 'forceLogout':
          authDispatch({ type: method, message: response.message });
          break;

        default:
          authDispatch({ type: method });
      }
    }
  };

  const { children } = props;
  return (
    <ServerContext.Provider value={{
      serverState,
      serverDispatch,
      gameState,
      gameDispatch,
    }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = (): IServerContext => useContext(ServerContext);
