var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var bodyParser = require('body-parser');

var app = express();
var server = http.Server(app);
var websocket = socketio(server);
server.listen(3000, () => console.log('listening on *:3000'));
let jogador1 = {jogada: '', id: ''};
let jogador2 = {jogada: '', id: ''};
let id = '';
let lobby = [];

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.io = websocket;
  next();
});

app.post('/jogada', (req, res) => {

  if (jogador1.id == ''){
    jogador1 = req.body.jogador
    console.log('Aguardando outro jogador');
  }     
  else if (jogador2.id == '')
    jogador2 = req.body.jogador

  if (jogador2.id != ''){
    if((jogador1.jogada == 'Pedra' && jogador2.jogada == 'Tesoura') ||  (jogador1.jogada == 'Tesoura' && jogador2.jogada == 'Papel') || (jogador1.jogada == 'Papel' && jogador2.jogada == 'Pedra'))
      id = jogador1.id;
    else if((jogador2.jogada == 'Pedra' && jogador1.jogada == 'Tesoura') ||  (jogador2.jogada == 'Tesoura' && jogador1.jogada == 'Papel') || (jogador2.jogada == 'Papel' && jogador1.jogada == 'Pedra'))
      id = jogador2.id;

    req.io.emit("lobbyWin", id);
  }
  
});

app.get("/batata", (req, res) => {
  return res.json({nome: "BATATA"});
})



// The event will be called when a client is connected.
websocket.on('connection', (socket) => {

  socket.on('login', (username)=>{
    var obj = {};
    obj.key = socket.id;
    obj.value = username;
    lobby.push(obj);
    console.log('A client just joined on', username);
  })

  socket.on('logout', (value) =>{
    lobby = lobby.filter((item) => {return item.key != value.id})
    console.log('User Disconect', value.username);
  })

  socket.on('disconnect', () => {
    lobby = lobby.filter((item) => {return item.key != socket.id})
    console.log('User Disconect', socket.id);
  });
});
