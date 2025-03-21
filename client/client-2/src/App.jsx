import { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const socketConnection = io('http://localhost:3000');
    setSocket(socketConnection);

    socketConnection.on('client-2', (data) => {
      setMessage(data);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit('client-2', 'Hello from client-2');
    }
  };

  return (
    <div>
      <h1>Cliente 2 WebSocket com React</h1>
      <button onClick={sendMessage}>Enviar Mensagem</button>
      <p>Mensagem do servidor: {message}</p>
    </div>
  );
}

export default App;
