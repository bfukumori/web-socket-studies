import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);

app.use(cors);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
  // console.log('A user connected', socket.id);

  // socket.on('disconnect', () => {
  //   console.log('A user disconnected', socket.id);
  // });

  socket.emit('server', 'Hello World from SERVER');

  socket.on('client', (msg) => {
    console.log(msg);
  });
  // socket.on('client', (msg) => {
  //   console.log('Log do server => ', msg);
  //   io.emit('server', 'Enviado do server após receber a msg');
  // });
});

// io.emit('server', 'Hello from server');

server.listen(3001, () => console.log('Server is running on port 3001'));
