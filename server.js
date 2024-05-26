const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const io = socketIo(server);
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

let lightData = [];

app.use(express.static('public'));

app.post('/api/light', (req, res) => {
  const { level } = req.body;
  lightData.push({ level, timestamp: Date.now() });

  lightData = lightData.filter(data => Date.now() - data.timestamp < 300000);

  io.emit('lightUpdate', { level, timestamp: Date.now() });

  res.status(200).send('Recibido');
});

io.on('conectado', (socket) => {
  console.log('Cliente conectado');

  socket.on('desconectado', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
