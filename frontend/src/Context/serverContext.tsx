import React, { ReactChild, createContext, useState, useContext } from 'react';
import { AuthContext } from "./authContext";
import socket from '../Socket/socket';
import { initialServerState, IServerContext, initialServerContext } from './interfaces';

interface Iprops {
  children: ReactChild
}

export const ServerContext = createContext<IServerContext>(initialServerContext)

export const ServerProvider = (props: Iprops) => {
  const [serverState, setServerState] = useState(initialServerState)
  const auth = useContext(AuthContext);
  const { login } = auth;

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

    switch(response.method) {
      case 'connected':
        setServerState({ ...serverState, uid: response.uid })
        break;

      case 'setUsername':
        setServerState({ ...serverState, displayName: response.username })
        login();
        break;
  
      case 'createGame':
        setServerState({ ...serverState, gid: response.gid })
        break;
  
      case 'incorrectGid':
        setServerState({ ...serverState, falseGID: true });
        break;
  
      case 'joinGame':
        setServerState({ ...serverState,
          gid: response.gid,
          falseGID: false,
          players: response.players,
          readyToStart: response.players.length === 2 ? true : false,
          whichPlayer: serverState.uid === response.players[0].uid ? 0 : 1
        })
        break;
  
      case 'onePlayerReady':
        setServerState({...serverState,
          players: serverState.players.map((player, index) => {
            return {...player, ready: response.players[index].ready}
          })
        })
        break;
  
      case 'newHand':
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
        break;
  
      case 'allIn':
        setServerState({...serverState,
          players: serverState.players.map((player, index) => (
            {...player, ...response.players[index]}
          )),
          stage: 'to-call',
          action: response.action === 'two' ? 1: 0,
          pot: response.pot
        });
        break;
  
      case 'showdown':
        setServerState({...serverState,
          players: serverState.players.map((player, index) => (
            {...player, ...response.players[index]}
          )),
          yourHand: response.players[serverState.whichPlayer].hand,
          oppHand: response.players[serverState.whichPlayer === 0 ? 1: 0].hand,
          community: response['community-cards'],
          stage: 'showdown',
          action: null,
          pot: response.pot
        });
        break;
  
      case 'folded':
        setServerState({...serverState,
          players: serverState.players.map((player, index) => (
            {...player, ...response.players[index]}
          )),
          stage: 'folded',
          action: null,
        });
        break;
  
      case 'winner':
        setServerState({...serverState,
          players: serverState.players.map((player, index) => (
            {...player, ...response.players[index]}
          )),
          pot: response.pot,
          winner: response.winner,
          action: null,
          winningHand: response['winning-hand'],
          stage: 'winner'
        })
        break;
  
      case 'playerBust':
        setTimeout(()=>{
          setServerState({...serverState,
            action: null,
            stage: 'end'
          })
        }, 2000)
        break;
  
      case 'backToLobby':  
        setServerState({...serverState,
          players: serverState.players.map((player, index) => (
            {...player, ...response.players[index]}
          )),
          yourHand: response.players[serverState.whichPlayer].hand,
          oppHand: response.players[serverState.whichPlayer === 0 ? 1: 0].hand,
          noOfRounds: response['number-of-rounds'],
          stage: response['stage'],
          inHand: false
        });
        break;

      default:
        console.log(`Method - ${response.method} - not matched`);
    }
  }
  
  return <ServerContext.Provider value={{ serverState, setServerState}}>{props.children}</ServerContext.Provider>
};