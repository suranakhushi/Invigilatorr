const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
app.use(express.static(path.join(__dirname, '/Face-Detection-Javascript-master')));
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for the 'video', 'audio', and 'screen' events from the client
  socket.on('video', (url) => {
    console.log('Received video URL:', url);
    // Process the video URL on the server as needed
  });

  socket.on('audio', (url) => {
    console.log('Received audio URL:', url);
    // Process the audio URL on the server as needed
  });

  socket.on('screen', (url) => {
    console.log('Received screen URL:', url);
    // Process the screen URL on the server as needed
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
const port = 5500;
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
