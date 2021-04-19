import { ReactNode } from 'react';

/*
Auth context
*/
export interface AuthState {
  authToken: string;
  displayName: string;
  email: string;
  bankroll: string;
}

export const initialAuthState: AuthState = {
  authToken: '',
  displayName: '',
  email: '',
  bankroll: '',
};

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

export const authReducerActions: AuthReducerAction['type'][] = [
  'login',
  'logout',
  'forceLogout',
];

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
  'rounds-won': 0,
  profit: 0,
};

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
  'community-cards': CommunityType;
  pot: number;
  'number-of-hands': number;
  winner: string;
  'winning-hand': WinningHand;
  'number-of-rounds': number;
  whichPlayer: number;
}

/*
Server context
*/
export type ServerReducerAction =
  | { type: 'socketOnOpen' }
  | { type: 'socketOnClose' }
  | { type: 'socketOnError' }
  | { type: 'resetServer' }
  | { type: 'connected', payload: WebsocketResponse };

export const serverReducerActions: ServerReducerAction['type'][] = [
  'socketOnOpen',
  'socketOnClose',
  'socketOnError',
  'resetServer',
  'connected',
];

export type GameReducerAction =
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

export const gameReducerActions: GameReducerAction['type'][] = [
  'setUsername',
  'createGame',
  'removeGid',
  'incorrectGid',
  'validGid',
  'joinGame',
  'onePlayerReady',
  'newHand',
  'allIn',
  'showdown',
  'folded',
  'winner',
  'playerBust',
  'backToLobby',
];

export type Action = number | null;

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

export type Card = [string, string] | [];

export type Hand = [Card, Card] | [];

export type CommunityType = [Card, Card, Card, Card, Card] | [];

export type CommunityCardsRanks = [number, number, number, number, number] | [];

export type WinningHand = [string, CommunityCardsRanks, CommunityType];

export interface ServerState {
  status: SocketStatus;
  uid: string;
}

export interface GameState {
  action: Action;
  community: CommunityType;
  displayName: string;
  falseGID: boolean;
  gid: string;
  inHand: boolean;
  noOfHands: number;
  noOfRounds: number;
  opponentName: string;
  oppHand: Hand;
  players: Array<Iplayer>;
  pot: number;
  gameHasEnoughPlayers: boolean;
  stage: Stage;
  uid: string;
  whichPlayer: number;
  winningHand: WinningHand;
  winner: string;
  yourHand: Hand;
}

export type ServerDispatch = (action: ServerReducerAction) => void;
export type GameDispatch = (action: GameReducerAction) => void;

export const initialServerState: ServerState = {
  status: 'disconnected',
  uid: '',
};

export const initialGameState: GameState = {
  inHand: false,
  uid: '',
  displayName: '',
  opponentName: '',
  gid: '',
  falseGID: false,
  gameHasEnoughPlayers: false,
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
  gameState: GameState;
  gameDispatch: GameDispatch;
}

export const initialServerContext: IServerContext = {
  serverState: initialServerState,
  serverDispatch: () => { /* do nothing */ },
  gameState: initialGameState,
  gameDispatch: () => { /* do nothing */ },
};
