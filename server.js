var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});



server.lastPlayderID = 0;

server.listen(process.env.PORT || 8081, function () {
    console.log('Listening on ' + server.address().port);
});



io.on('connection', function (socket) {

    socket.on('newplayer', function (data) {

        console.log("[new player data]", data);

        let sanePlayerName = data.playerName.replace(/[^a-zA-Z0-9\-_ ]/g, '');
        let fleetPos = data.fleetPos;

        socket.player = {
            id: sanePlayerName + " #" + (server.lastPlayderID++)
        };

        socket.emit('allplayers', getAllPlayers());

        socket.broadcast.emit('newopponent', { id: socket.player.id });

        socket.on('click', function (data) {

            console.log('click to ' + data.x + ', ' + data.y);
            socket.player.playerName = data.playerName;
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move', socket.player);
        });

        socket.on('disconnect', function () {

            io.emit('remove', socket.player.id);
        });
    });

    socket.on('test', function () {

        console.log('test received');
    });
});



function getAllPlayers() {

    var players = [];
    Object.keys(io.sockets.connected).forEach(function (socketID) {

        var player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
    return players;
}



function placeShips() {

    let needPlacement = true;
    let pos = {};
    let grid;

    while (needPlacement) {

        grid = new Array(18).fill(new Array(6).fill(false));

        pos.carrier = Math.random() >= 0.5 ? { // horizontal
            x: rnd(3),
            y: rnd(17)
        } : { // vertical
            x: rnd(5),
            y: rnd(15)
        };
    }


}


function rnd(n) { return Math.floor(n * Math.random()); }



