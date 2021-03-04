
import { Dispatch, SetStateAction, ReactChild } from 'react';

export interface iProps {
  children: ReactChild
}

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

export interface Icontext {
  status: string,
  inHand: boolean,
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

export const initialState: Icontext = {
  status: 'disconnected',
  inHand: false,
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