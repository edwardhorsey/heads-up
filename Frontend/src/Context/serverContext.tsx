import React, { createContext, useState, useEffect } from 'react';

export const socket = new WebSocket("ws://127.0.0.1:5000/");
socket.onopen = () => console.log('connected to server')
socket.onclose = () => console.log('disconnected from server')

interface Icontext {
  uid: string | undefined,
  displayName: string | undefined,
  gid: number | undefined,
}

const initialState: Icontext = {
  uid: undefined,
  displayName: undefined,
  gid: undefined
}

const waitingRoom = (response: string) => {
  console.log(response);
}

export const ServerContext = createContext<Icontext | any>(initialState)

export const ServerProvider = (props: any) => {
  
  const [cState, setCState] = useState(initialState)

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data)
    if (response.method === 'connected') {
      setCState({...cState, uid: response.uid });
    }
    if (response.method === 'create-game') {
      waitingRoom(response);
    }
  }

  return <ServerContext.Provider value={{cState, setCState}}>{props.children}</ServerContext.Provider>

}