import socket from './socket';

export const setUsername = (username: string): void => (
  socket.send(JSON.stringify({
    username,
    action: 'onGameAction',
    method: 'setUsername',
  }))
);

export const sendCognitoCode = (code: string): void => (
  socket.send(JSON.stringify({
    code,
    action: 'onGameAction',
    method: 'login',
  }))
);

export const createGame = (uid: string): void => (
  socket.send(JSON.stringify({
    action: 'onGameAction',
    method: 'createGame',
    uid,
  }))
);

export const joinGame = (gid: string, uid: string): void => (
  socket.send(JSON.stringify({
    action: 'onGameAction',
    method: 'joinGame',
    uid,
    gid,
  }))
);

export const addChips = (gid: string, uid: string, amount: number): void => (
  socket.send(JSON.stringify({
    action: 'onGameAction',
    method: 'addChips',
    uid,
    gid,
    amount,
  }))
);

export const readyToPlayHand = (gid: string, uid: string): void => (
  socket.send(JSON.stringify({
    action: 'onGameAction',
    method: 'readyToPlay',
    uid,
    gid,
    ready: true,
  }))
);

export const allIn = (gid: string, uid: string): void => (
  socket.send(JSON.stringify({
    action: 'onGameAction',
    method: 'allIn',
    uid,
    gid,
  }))
);

export const call = (gid: string, uid: string, betSize: number): void => (
  socket.send(JSON.stringify({
    action: 'onGameAction',
    method: 'call',
    uid,
    gid,
    'amount-to-call': betSize,
  }))
);

export const fold = (gid: string, uid: string): void => (
  socket.send(JSON.stringify({
    action: 'onGameAction',
    method: 'fold',
    uid,
    gid,
  }))
);

export const backToLobby = (gid: string, uid: string): void => (
  socket.send(JSON.stringify({
    action: 'onGameAction',
    method: 'backToLobby',
    uid,
    gid,
  }))
);

/*
export const leaveGame = (gid: string): void => {
  const request = {
    action: 'onGameAction',
    method: 'leaveGame',
    gid,
  }

  return socket.send(JSON.stringify(request));
};
*/
