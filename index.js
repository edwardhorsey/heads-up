const socket = new WebSocket("ws://127.0.0.1:5000/");

const setName = document.getElementById('set-name');
const afterSetName = document.getElementById('name-set');
afterSetName.style.display = 'none';

const nameInput = document.getElementById('name-input');
const nameDisplay = document.getElementById('your-name');
const chatInput = document.getElementById('chat-input');
const chat = document.getElementById('chat');

class User {
  constructor(name) {
    this.username = name;
  }
}

let user;

socket.addEventListener('open', (event) => {
  console.log('Connected to server');
})

socket.addEventListener('close', (event) => {
  console.log('Disconnected to server');
})

socket.addEventListener('message', (event => {
  response = JSON.parse(event.data)
  const message = `${response.username}: ${response.message}\n`
  chat.innerHTML += message;
}))

const setYourName = () => {
  const name = nameInput.value;
  user = new User(name);
  nameDisplay.innerHTML = name;
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