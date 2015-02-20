var express = require('express');
var app = express();
var compression = require('compression');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/drawing');

var Schema = mongoose.Schema;


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log('connected to drawing db');
});

app.use(compression());
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.vary('Accept-Encoding');
  res.sendFile(__dirname + '/index.html');
  
});

io.on('connection', function(socket){
	
	console.log('a user connected');
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	
	socket.on('data', function(data){
    	console.log('data: ' + data);
    	socket.broadcast.emit('data', data);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
