
import { Dispatch, SetStateAction } from 'react';

/*
Auth context
*/
export interface AuthState {
  authToken: string;
  displayName: string;
  email: string;
}

export const initialAuthState: AuthState = {
  authToken: '',
  displayName: '',
  email: '',
}

export interface IAuthContext {
  authState: AuthState;
  setAuthState: Dispatch<SetStateAction<AuthState>>;
  login: (userDetails: AuthState) => void;
  logout: () => void;
}

export const initialAuthContext = {
  authState: initialAuthState,
  setAuthState: () => {},
  login: () => {},
  logout: () => {},
};

/*
Player
*/

export interface Iplayer {
  uid: string,
  name: string,
  bankroll: number,
  ready: boolean,
  'bet-size': number,
  hand: Hand,
  folded: boolean,
  blind: number,
  'rounds-won': number,
  profit: number
}

export const initialPlayer: Iplayer = {
  uid: '',
  name: '',
  bankroll: 0,
  ready: false,
  'bet-size': 0,
  hand: [],
  folded: false,
  blind: 0,
  'rounds-won': 0,
  profit: 0
}

/*
Server context
 */

export type ActionType = 'socketOnOpen'
| 'socketOnClose'
| 'socketOnError'
| 'resetServer'
| 'connected'
| 'login'
| 'setUsername'
| 'createGame'
| 'removeGid'
| 'incorrectGid'
| 'validGid'
| 'joinGame'
| 'onePlayerReady'
| 'newHand'
| 'allIn'
| 'showdown'
| 'folded'
| 'winner'
| 'playerBust'
| 'backToLobby';

export type Stage = 'initial'
| 'preflop'
| 'to-call'
| 'folded'
| 'winner'
| 'showdown'
| 'end'
| 'backToLobby';

export type SocketStatus = 'disconnected'
| 'connected'
| 'error';

export type Card = string[];
export type Hand = Card[];

export interface Action {
  type: ActionType;
  payload?: any;
}
export interface ServerState {
  status: SocketStatus; // websocket server
  inHand: boolean; // player 
  uid: string; // player 
  displayName: string; // player 
  opponentName: string; // game
  gid: string; // game
  falseGID: boolean; // app
  readyToStart: boolean; // game
  action: number | null; // game
  stage: Stage; // app
  players: Array<Iplayer>; // game
  whichPlayer: number; // game
  oppHand: Hand; // game
  yourHand: Hand; // game
  community: Hand; // game
  winningHand: [string, number[], Hand]; // game
  winner: string; // game
  pot: number; // game
  noOfHands: number; // game
  noOfRounds: number; // game
}

export type ServerDispatch = (action: Action) => void;

export const initialServerState: ServerState = {
  status: 'disconnected',
  inHand: false,
  uid: '',
  displayName: '',
  opponentName: '',
  gid: '',
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
};


export interface IServerContext {
  serverState: ServerState;
  serverDispatch: ServerDispatch;
  // resetServerState: () => void;
}
export const initialServerContext: IServerContext = {
  serverState: initialServerState,
  serverDispatch: () => {},
}