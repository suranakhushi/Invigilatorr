const express = require('express');
const app = express();
const path = require('path'); 
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
app.use(express.static(path.join(__dirname, '/Face-Detection-Javascript-master')));
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('video', (url) => {
    console.log('Received video URL:', url);
  
  });

  socket.on('audio', (url) => {
    console.log('Received audio URL:', url);
   
  });

  socket.on('screen', (url) => {
    console.log('Received screen URL:', url);
    
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
const port = 5500;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
