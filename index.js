const socket = new WebSocket("ws://127.0.0.1:5000/");

const setName = document.getElementById('set-name');
const main = document.getElementById('main');
main.style.display = 'none';

const nameInput = document.getElementById('name-input');
const nameDisplay = document.getElementById('your-name');

const chatInput = document.getElementById('chat-input');
const chat = document.getElementById('chat');

const createGameID = document.getElementById('create-game-id');
const createdGame = document.getElementById('created-game');
const createOrJoin = document.getElementById('create-or-join');

const joinGameInput = document.getElementById('join-game-input');
const gameWelcomeHeader = document.getElementById('game-welcome');

const gameDisplay = document.getElementById('game');

class User {
  constructor(name, uid) {
    this.name = name;
    this.uid = uid;
  }
}

let user;
let uid;

socket.addEventListener('open', () => {
  console.log('Connected to server');
})

socket.addEventListener('close', () => {
  console.log('Disconnected to server');
})

socket.addEventListener('message', (event => {
  response = JSON.parse(event.data)
  if (response.method === 'connected') {
    console.log('Your uid: ', response.uid);
    uid = response.uid
  } else if (response.method === 'chat') {
    receiveMsg(response);
  } else if (response.method === 'create-game') {
    waitingRoom(response);
  } else if (response.method === 'joined-game') {
    beginGame(response);
  }
}))

const setYourName = () => {
  user = new User(nameInput.value, uid);
  nameDisplay.innerHTML = nameInput.value;
  setName.style.display = 'none';
  main.style.display = 'block';
};

const sendMsg = () => {
  const request = {
    'method': 'chat',
    'value': {
      'name': user.name,
      'message': chatInput.value
    }
  };
  socket.send(JSON.stringify(request));
};

const receiveMsg = (response) => {
  const message = `${response.value.name}: ${response.value.message}` + '<br>'
  chat.innerHTML += message;
};

const createGame = () => {
  const request = {
    'method': 'create-game',
    'uid': user.uid,
    'display-name': user.name
  };
  socket.send(JSON.stringify(request));
}

const waitingRoom = (response) => {
  createOrJoin.style.display = 'none';
  createGameID.innerHTML = response.gid;
  createGameID.innerHTML += '\nTell your friend';
  gameWelcomeHeader.innerText += ' ' + response.gid;
  gameDisplay.innerHTML += '<p>Waiting for second player</p>';
}

const joinGame = () => {
  createOrJoin.style.display = 'none';
  const request = {
    'method': 'join-game',
    'uid': user.uid,
    'display-name': user.name,
    'gid': joinGameInput.value
  };
  console.log(request);
  socket.send(JSON.stringify(request));
}

const beginGame = (response) => {
  createdGame.style.display = 'none';
  console.log(response);
  const playerOneName = response.players['player-one'].name;
  const playerTwoName = response.players['player-two'].name;
  if (response.uids[0] === user.uid) gameDisplay.innerHTML += `<p>${playerTwoName} has joined</p>`;
  gameDisplay.innerHTML += `<p>Welcome ${playerOneName} and ${playerTwoName}</p>`;
}