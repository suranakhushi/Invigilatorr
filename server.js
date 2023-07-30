const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const faceApiFolderPath = path.join(__dirname, 'Face-Detection-JavaScript-master');
app.use(express.static(faceApiFolderPath));

io.on('connection', (socket) => {
  console.log('A user connected.');

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
  socket.on('customEvent', (data) => {
    console.log('Received customEvent data:', data);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
