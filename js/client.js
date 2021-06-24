
var Client = {};
Client.socket = io.connect();

Client.sendTest = function () {

    console.log("test sent");
    Client.socket.emit('test');
};



Client.askNewPlayer = function (playerName, fleetPos) {

    Client.socket.emit('newplayer', { playerName: playerName, fleetPos: fleetPos });
};



Client.sendClick = function (x, y) {

    Client.socket.emit('click', { x: x, y: y });
};



Client.socket.on('newopponent', function (data) {

    Game.addNewOpponent(data.id);
});



Client.socket.on('allplayers', function (data) {

    for (var i = 0; i < data.length; i++) {
        Game.addNewOpponent(data[i]);
    }
    serversidePlayerName = data[data.length-1].id;

    Client.socket.on('move', function (data) {

        Game.movePlayer(data.id, data.x, data.y);
    });

    Client.socket.on('remove', function (id) {

        Game.removePlayer(id);
    });
});




var Game = {};
var serversidePlayerName = false;

Game.addNewOpponent = function (data) {

    console.log("[new player]", data);
};



Game.movePlayer = function (id, x, y) {

    if (id == serversidePlayerName)
        newMissile(x, y, seaPos(-1.6, 0.5 + Math.floor(3 * Math.random()) * 8).x, seaPos(-2, 0.5 + Math.floor(3 * Math.random()) * 8).y, 8, 1, true);
    else
        newMissile(app.renderer.view.width - x, y, app.renderer.view.width - seaPos(-1.6, 0.5 + Math.floor(3 * Math.random()) * 8).x, seaPos(-2, 0.5 + Math.floor(3 * Math.random()) * 8).y, 8, 1, false);

    //console.log("[move player]", id, x, y);
};



Game.removePlayer = function (id) {

    console.log("[remove player]", id);
};


