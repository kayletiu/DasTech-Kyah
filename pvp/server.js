// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
  // other handlers ...
  socket.on('disconnect', function() {
    // remove disconnected player
  });
});

var refresh = 0;
var winner = {
    name: ""
};
var ready = {
    r: 0
};
var connected = {
    c: 0
};
var players = {};
io.on('connection', function(socket) {
  connected.c += 1;
  socket.on('new player', function(data) {
    players[socket.id] = {
      n: data.name,
      x: 300,
      y: 550,
      s: 0
    };
  });
  
  socket.on('click', function(data) {
     if (ready.r == connected.c){
         var player = players[socket.id] || {};
         player.s += 1;
         player.y -= 10;
         if (player.s == 50){
             refresh = 1;
             winner.name = player.n;
         }
     }
     
  });
    socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
  });
    
  socket.on('disconnect', function() {
    players[socket.id] = socket;
    delete players[socket.id];
    connected.c -= 1;
    ready.r = 0;
  });
    
  socket.on('ready', function(){
      ready.r += 1;
  });
});

setInterval(function() {
  if (refresh == 0){
    io.sockets.emit('state', players);
    io.sockets.emit('connected', connected);
    io.sockets.emit('ready', ready);
  }
  if (refresh == 1){
     io.sockets.emit('refresh', winner); 
     refresh = 0;
     ready.r = 0; 
  }
}, 1000 / 60);