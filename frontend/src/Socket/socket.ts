const ws: string = process.env.REACT_APP_STAGE === 'dev' ? (
  'ws://127.0.0.1:3001/'
) : (
  process.env.REACT_APP_API_URL as string
);

const socket = new WebSocket(ws);

export default socket;