var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var playersOnline = [];
var i = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let jogadas = []; //Pensar se let seria a melhor opção;

io.on('connection', function(socket){
  console.log('a user connected ' + socket.id);
  //Linha onde vai acontecer o pareamento de jogadores;
  if(playersOnline.length > 0){ //Se houverem players na fila ele faz o pareamento;
    socket.emit('pareamento', playersOnline[0]); //Principio de uma fila de espera;
    playersOnline.splice(0,1); //Removendo a pessoa que está sendo pareada da fila;
  }else{ //Senão adiciona a fila de espera;
    playersOnline[i] = socket.id; //Adicionando a pessoa que está se conectando a fila;
    //i++; //Imaginar se manter comentado realmente é a melhor opção;
    //Possibilidade de emitir um evento avisando ao player para aguardar;
  }
  socket.on('disconnect', function(){
    var index = playersOnline.indexOf(socket.id); //Encontra o indice do socket.id de quem está se desconectando;
    if(index >= 0){ //Verifica se o indice é valido;
      playersOnline.splice(index,1); //Remove o indice do vetor de players online;
    }
    console.log('user disconnected ' + socket.id);
  });
  socket.on('jogada', function(jogada){
    jogadas.push(jogada);
    io.to(jogada.socketId).emit('jogadasFeitas', jogada.id);
  });
  socket.on('escolheVez', function(id){
    io.to(id.socketId).emit('Vez', id.id);
  });
  socket.on('pareamentoACK', function(socketId, socketAdversario){
    io.to(socketAdversario).emit('pareamento', socketId);
  });
});

const porta = process.env.PORT || 3000;
http.listen(porta, function(){
  console.log('listening on *: '+porta);
});