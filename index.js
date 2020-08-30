const socket = new WebSocket("ws://127.0.0.1:5000/");

const setName = document.getElementById('set-name');
const afterSetName = document.getElementById('name-set');
afterSetName.style.display = 'none';

const nameInput = document.getElementById('name-input');
const nameDisplay = document.getElementById('your-name');
const chatInput = document.getElementById('chat-input');
const chat = document.getElementById('chat');
const gameID = document.getElementById('game-id')

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
    const response = response.value;
    const message = `${response.username}: ${response.message}` + '<br>'
    chat.innerHTML += message;
  } else if (response.method === 'create-game') {
    gameID.innerHTML = response.gid;
    gameID.innerHTML += '\nTell your friend';
  }
    
}))

const setYourName = () => {
  user = new User(nameInput.value, uid);
  nameDisplay.innerHTML = nameInput.value;
  setName.style.display = 'none';
  afterSetName.style.display = 'block';
}

const sendMsg = () => {
  const request = {
    'method': 'chat',
    'value': {
      'username': user.username,
      'message': chatInput.value
    }
  }
  socket.send(JSON.stringify(request));
} 

const createGame = () => {
  const request = {
    'method': 'create-game',
    'uid': user.uid,
    'display-name': user.name
  };
  socket.send(JSON.stringify(request))
}