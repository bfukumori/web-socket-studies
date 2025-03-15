import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.get('/', (_req, res) => {
  res.send('Web Socket Server is running');
});

io.on('connection', (socket) => {
  console.log('New user connected -> ', socket.id);

  socket.on('client-1', (data) => {
    console.log('From client-1 -> ', data);

    socket.emit('client-1', 'Hello from server to client-1');
  });

  socket.on('client-2', (data) => {
    console.log('From client-2 -> ', data);

    socket.emit('client-2', 'Hello from server to client-2');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected -> ', socket.id);
  });
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
