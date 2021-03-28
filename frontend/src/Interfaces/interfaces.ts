
import { ReactNode } from 'react';

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
  authDispatch: AuthDispatch;
  login: (response: WebsocketResponse) => void;
}

export const initialAuthContext = {
  authState: initialAuthState,
  authDispatch: (): void => { /* do nothing */ },
  login: (): void => { /* do nothing */ },
};

export interface AuthProviderProps {
  children: ReactNode;
}

export type AuthReducerAction = 
  | { type: 'login', userObject: AuthState }
  | { type: 'logout' }
  | { type: 'forceLogout', message: string; };

export type AuthDispatch = (action: AuthReducerAction) => void;

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
Websocket response
*/

export interface WebsocketResponse {
  uid: string;
  gid: string;
  message: string;
  userObject: AuthState;
  players: Iplayer[];
  action: string;
  stage: Stage;
  'community-cards': Card[];
  pot: number;
  'number-of-hands': number;
  winner: string;
  'winning-hand': WinningHand;
  'number-of-rounds': number;
}

/*
Server context
*/

export type ServerReducerAction = 
 | { type: 'socketOnOpen' }
 | { type: 'socketOnClose' }
 | { type: 'socketOnError' }
 | { type: 'resetServer' }
 | { type: 'connected', payload: WebsocketResponse }
 | { type: 'login', payload: WebsocketResponse }
 | { type: 'forceLogout', payload: WebsocketResponse }
 | { type: 'setUsername', payload: WebsocketResponse }
 | { type: 'createGame', payload: WebsocketResponse }
 | { type: 'removeGid' }
 | { type: 'incorrectGid', payload: WebsocketResponse }
 | { type: 'validGid' }
 | { type: 'joinGame', payload: WebsocketResponse }
 | { type: 'onePlayerReady', payload: WebsocketResponse }
 | { type: 'newHand', payload: WebsocketResponse }
 | { type: 'allIn', payload: WebsocketResponse }
 | { type: 'showdown', payload: WebsocketResponse }
 | { type: 'folded', payload: WebsocketResponse }
 | { type: 'winner', payload: WebsocketResponse }
 | { type: 'playerBust', payload: WebsocketResponse }
 | { type: 'backToLobby', payload: WebsocketResponse };

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

export type WinningHand = [string, number[], Hand];

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
  winningHand: WinningHand; // game
  winner: string; // game
  pot: number; // game
  noOfHands: number; // game
  noOfRounds: number; // game
}

export type ServerDispatch = (action: ServerReducerAction) => void;

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

export interface ServerProviderProps {
  children: ReactNode;
}

export interface IServerContext {
  serverState: ServerState;
  serverDispatch: ServerDispatch;
}

export const initialServerContext: IServerContext = {
  serverState: initialServerState,
  serverDispatch: () => { /* do nothing */ },
}