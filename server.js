var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var token;

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



var newRoom = false;
var anonymousRoomId = 0n;
var missileId = 0n;
var rooms = {};

io.on('connection', function (socket) {


    socket.on('who', function (data) {

        socket.emit('playerlist', getAllPlayers());
    });

    socket.on('newplayer', function (data) {

        console.log("[new player data]", data);

        let sanePlayerName = data.playerName.replace(/[^a-zA-Z0-9\-_ ]/g, '').trim();
        sanePlayerName = sanePlayerName[0].toUpperCase() + sanePlayerName.substr(1, 16);

        let saneRoomName = data.roomName.replace(/[^a-zA-Z0-9\-_ ]/g, '').trim().substr(0, 16);

        socket.player = {
            id: sanePlayerName + " | " + data.success + "% #" + (server.lastPlayderID++),
            lastLauncherUsed: -1,
            nextShotDate: Date.now(),
            delay: 1200,
            success: data.success,
            activeBoats: 4
        };

        socket.player.fleetPos = data.fleetPos;

        socket.player.launchers = [-100/6, 100/6];
        
        socket.player.token = data.token;

        if (saneRoomName.length > 0) {

            socket.player.room = saneRoomName;
            socket.join(saneRoomName);
            startGame(socket, saneRoomName);
        
        } else {
            if (!newRoom) {
                newRoom = "room #" + (anonymousRoomId++);
                socket.player.room = newRoom;
                socket.join(newRoom);
                startGame(socket, newRoom);
            } else {
                socket.player.room = newRoom;
                socket.join(newRoom);
                startGame(socket, newRoom);
                newRoom = false;
            }
        }

    });
});



function startGame(socket, room) {

    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(socket);

    if (rooms[room].length == 2) {
        rooms[room][0].player.opponent = rooms[room][1].player;
        rooms[room][1].player.opponent = rooms[room][0].player;
        console.log("opponents informed");
    }

    io.to(socket.player.room).emit('allplayers', getAllPlayers());

    socket.to(socket.player.room).broadcast.emit('newopponent', only(socket.player, ["id", "launchers"]));

    socket.on('boom', function (data) {

        console.log("BOOOOOOOOOOOOOOOOOOOOM", data);
        if (data.nuke) {

            let target = (data.missileId.split('→')[0] == socket.player.id) ? socket.player.opponent : socket.player;

            let bancolacagnotte = false;
            let reveal = false;
            let end = false;

            for (let boat in target.fleetPos)
                for (let part of target.fleetPos[boat].parts)
                    if (part.x == data.nuke.x && part.y == data.nuke.y) {
                        bancolacagnotte = true;
                        part.x = -1; part.y = -1;
                        target.fleetPos[boat].hp -= 1;
                        if (target.fleetPos[boat].hp == 0) reveal = {
                            [boat]: target.fleetPos[boat]
                        };
                    }
            
            if (reveal) --target.activeBoats;
            if (!target.activeBoats) end = true;

            io.to(socket.player.room).emit('nuked', {
                nukedPlayer: target.id,
                x: data.nuke.x,
                y: data.nuke.y,
                hit: bancolacagnotte,
                reveal: reveal,
                end: end
            });
        }
    });

    socket.on('click', function (data) {

        console.log('click to ' + data.x + ', ' + data.y);

        let now = Date.now();
        socket.player.delayBeforeShoot = Math.max(0, socket.player.nextShotDate - now);
        socket.player.nextShotDate = Math.max(now, socket.player.nextShotDate) + socket.player.delay;
        if (socket.player.delay > 0) socket.player.delay = Math.floor(socket.player.delay * 0.95);

        socket.player.playerName = data.playerName;
        socket.player.x = data.x;
        socket.player.y = data.y;
        socket.player.nuke = data.nuke;

        var thisMissile = socket.player.id + "→" + (missileId++).toString();

        socket.player.missileId = thisMissile;

        io.to(socket.player.room).emit('ack', only(socket.player, ["id", "x", "y", "missileId"]));

        setTimeout(() => {
    
            socket.player.playerName = data.playerName;
            socket.player.x = data.x;
            socket.player.y = data.y;
            socket.player.missileId = thisMissile;
            socket.player.nuke = data.nuke;

            let zone = Math.floor(socket.player.launchers.length * Math.random());
            let dist = Infinity;
            for (let l = 0; l < socket.player.launchers.length; l++)
                if (Math.abs(data.y - socket.player.launchers[l]) < dist) {
                    zone = l;
                    dist = Math.abs(data.y - socket.player.launchers[l]);
                }
            while (zone == socket.player.lastLauncherUsed) zone = Math.floor(socket.player.launchers.length * Math.random());
            socket.player.launcherNum = zone;
            socket.player.lastLauncherUsed = zone;

            socket.player.missileType = data.nuke ? "solsol" : "solair";
    
            io.to(socket.player.room).emit('move', only(socket.player, ["id", "x", "y", "launcherNum", "missileType", "missileId", "nuke"]));
    
        }, socket.player.delayBeforeShoot);
    });

    socket.on('disconnect', function () {

        rooms[room] = rooms[room].filter(s => s != socket);
        if (rooms[room].length == 0) delete rooms[room];
        io.to(socket.player.room).emit('remove', socket.player.id);
    });
}



function getAllPlayers() {

    var players = [];
    Object.keys(io.sockets.connected).forEach(function (socketID) {

        var player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
    return players.map(p => only(p, ["id", "playerName", "launchers", "room", "token"]));
}




function only(object, keys) {

    let result = {};
    for (let key of keys) result[key] = object[key];
    return result;
}



