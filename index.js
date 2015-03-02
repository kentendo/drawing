var express = require('express');
var favicon = require('serve-favicon');
var app = express();
var compression = require('compression');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/drawing';
var db;

app.use(compression());
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.get('/', function(req, res) {
	res.vary('Accept-Encoding');
	res.sendFile(__dirname + '/index.html');
});

// Initialize db and start listening
MongoClient.connect("mongodb://localhost:27017/drawing", function(err, database) {
	// TODO
	// instead of commenting out error, send message to client saying this will not be recorded
	// but will still be sent to all other users connected
	
	if(err) {
		console.log(err);
		//throw err;
	} else {
		db = database;
	}
	
	// start up the app regardless of the db
	http.listen(3000, function() {
		console.log('drawing app started');
	});
});

io.on('connection', function(socket) {
	
	// handle new connection 
	if(db) {
		db.collection("lines").find({timestamp:{$lt:Date.now()}}).toArray(function(err, docs) {
			io.sockets.connected[socket.id].emit('startup', docs);
		});
	}
	
	// handle disconnect
	socket.on('disconnect', function() {
		// TODO
		// send message to client saying someone disconnected
	});
	
	// handle new data
	// send it out to everyone and then try and save it
	socket.on('data', function(data) {
		socket.broadcast.emit('data', data);
		if(db)
		{
			data.timestamp = Date.now();
			db.collection("lines").insert(data, {w:1}, function(err, result) {});
		}
	});
});


