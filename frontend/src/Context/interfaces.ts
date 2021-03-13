
import { Dispatch, SetStateAction } from 'react';

/*
Auth context
*/
export interface AuthState {
  authToken: string;
}

export const initialAuthState: AuthState = {
  authToken: '',
}

export interface IAuthContext {
  authState: AuthState;
  setAuthState: Dispatch<SetStateAction<AuthState>>;
  login: () => void;
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
  hand: string[][],
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

export interface ServerState {
  status: string;
  inHand: boolean;
  uid: string;
  displayName: string;
  opponentName: string;
  gid: string;
  falseGID: boolean
  readyToStart: boolean;
  action: number | null;
  stage: string;
  players: Array<Iplayer>;
  whichPlayer: number;
  oppHand: string[];
  yourHand: string[];
  community: string[];
  winningHand: [string, number[], string[]];
  winner: string;
  pot: number;
  noOfHands: number;
  noOfRounds: number;
}

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
  setServerState: Dispatch<SetStateAction<ServerState>>;
  resetServerState: () => void;
}

export const initialServerContext: IServerContext = {
  serverState: initialServerState,
  setServerState: () => {},
  resetServerState: () => {},
}