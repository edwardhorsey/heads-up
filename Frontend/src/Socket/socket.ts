const socket = new WebSocket("ws://127.0.0.1:5000/");
socket.onopen = () => console.log('connected to server');
socket.onclose = () => console.log('disconnected from server');

export default socket;