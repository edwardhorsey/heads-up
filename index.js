const socket = new WebSocket("ws://127.0.0.1:5000/");

const setName = document.getElementById('set-name');
const afterSetName = document.getElementById('name-set');
afterSetName.style.display = 'none';


const nameInput = document.getElementById('name-input');
const nameDisplay = document.getElementById('your-name');
const chatInput = document.getElementById('chat-input');
const chat = document.getElementById('chat');

socket.addEventListener('open', (event) => {
  console.log('Connected to server');
  console.log(event);
})

socket.addEventListener('close', (event) => {
  console.log('Disconnected to server');
  console.log(event);
})

socket.addEventListener('message', (event => {
  console.log('Message from server: ', event.data);
  let name = nameInput.value;
  let message = `${name}: ${event.data.slice(21)}`
  chat.innerHTML += message;
  chat.innerHTML += '<br>';
}))

const setYourName = () => {
  console.log('hi')
  let name = nameInput.value;
  nameDisplay.innerHTML = name;
  setName.style.display = 'none';
  afterSetName.style.display = 'block';
}


const sendMsg = () => {
  let bit = chatInput.value;
  socket.send(bit);
}