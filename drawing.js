var express = require('express');
var favicon = require('serve-favicon');
var app = express();
var compression = require('compression');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/drawing';
	

app.use(compression());
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.get('/', function(req, res) {
	res.vary('Accept-Encoding');
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	
	MongoClient.connect(dbUrl, function(err, db) {
		var collection = db.collection("lines");
		collection.find({timestamp:{$lt:Date.now()}}).toArray(function(err, docs) {
			io.sockets.connected[socket.id].emit('startup', docs);	
			db.close();
		});
	});

	socket.on('disconnect', function() {
		console.log('user disconnected');
	});

	socket.on('data', function(data) {
		socket.broadcast.emit('data', data);
		MongoClient.connect(dbUrl, function(err, db) {
			var collection = db.collection("lines");
			data.timestamp = Date.now();
			collection.insert(data, {w:1}, function(err, result) {});
			db.close();
		});
	});
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});
