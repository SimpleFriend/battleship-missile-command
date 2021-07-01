
var Client = {};
Client.socket = io.connect();



Client.askNewPlayer = function (playerName, fleetPos, roomName) {

    Client.socket.emit('newplayer', { playerName: playerName, fleetPos: my.fleetPos, token: token, roomName: roomName, success: success });
};



Client.sendClick = function (pos, nuke) {

    Client.socket.emit('click', { x: pos.x, y: pos.y, nuke: nuke });
};



Client.boom = function (missileId, x, y, nuke) {

    Client.socket.emit('boom', { x: x, y: y, missileId: missileId, nuke: nuke });
};



Client.who = function (pos) {

    Client.socket.emit('who');
};



Client.socket.on('newopponent', function (data) {

    console.log("[new opponent]", data);
});



Client.socket.on('playerlist', function (data) {

    Game.playerList = data;

    let who = document.getElementById("who");
    let list = Game.playerList.map(p => simplifyName(p.id).split('|')[0].trim());
    list = list.slice(0, 20);
    if (list.length == 20) list.push('...etc. ('+Game.playerList.length+')');

    let score = `<br>
    ${victories} victor${victories>1?'ies':'y'} |
    ${defeats} defeat${defeats>1?'s':''} |
    ${success}% success`;

    if (who) who.innerHTML = "<b>Connected Players |</b> " + list.join(', ') + score;
});



Client.socket.on('allplayers', function (data) {

    console.log("[allplayers]", data);
    Game.playerList = data;
    
    if (!serversidePlayerName) {
        
        for (let datum of data) if (token.indexOf(datum.token) > -1) my = datum;

        buildLaunchers(true, data[data.length-1].launchers, my.id);

        serversidePlayerName = my.id;



        Client.socket.on('move', function (data) {

            let pos = posGameToScreen({ x: data.x, y: data.y });

            Game.movePlayer(data.id, pos.x, pos.y, data.launcherNum, data.missileType, data.missileId, data.nuke);
        });



        Client.socket.on('ack', function (data) {

            let pos = posGameToScreen({ x: data.x, y: data.y });

            Game.ackPlayer(data.id, pos.x, pos.y, data.missileId);
        });



        Client.socket.on('nuked', function (data) {

            console.log("[NUKED]", data);
            let blue = data.nukedPlayer == serversidePlayerName;

            if (data.hit) {

                let burn = new PIXI.Sprite(
                    PIXI.loader.resources[`assets/r-unit.png`].texture
                );
                burn.scale.x = boatScale * 0.666;
                burn.scale.y = boatScale * 0.666;
                burn.anchor.x = 0.5;
                burn.anchor.y = 0.5;
                let pos = posGameToScreen(seaPos(data.x, data.y - 0.5));
                burn.x = blue ? pos.x : app.renderer.view.width - pos.x;
                burn.y = pos.y;
                particles.burnContainer.addChild(burn);
                console.log("[burn]", burn, pos);

                if (data.end) {
                    if (blue) Game.looseGame(); else Game.winGame();
                }
            }

            if (!blue && data.reveal) displayBoats(data.reveal, true);

            particles.dotContainer[blue].removeChild(                
                dots[`${blue?'b':'r'}-x${data.x}y${data.y}`]
            );
                            
            dots[`${blue?'b':'r'}-x${data.x}y${data.y}`] = false;
        });

        

        Client.socket.on('remove', function (id) {

            Game.winGame();
        });
    }
    
    for (let player of Game.playerList)
        if (player.id != my.id && player.room == my.room)
            buildLaunchers(false, player.launchers, player.id);
});




var Game = {
    playerList: []
};
var serversidePlayerName = false;



Game.ackPlayer = function (id, x, y, mid) {

    tmpCrossHair(x, y, id == serversidePlayerName, mid);
}


Game.movePlayer = function (id, x, y, num, missileType, mid, nuke) {

    if (id == serversidePlayerName)
        newMissile(
            x, y,
            launcherPos[true][num].x,
            launcherPos[true][num].y,
            missileType == "solair" ? 15 : 5,
            missileType == "solair" ? 1 : 1.25,
            true, missileType, mid, nuke);
    else
        newMissile(
            app.renderer.view.width - x, y,
            launcherPos[false][num].x,
            launcherPos[false][num].y,
            missileType == "solair" ? 15 : 5,
            missileType == "solair" ? 1 : 1.25,
            false, missileType, mid, nuke);

    console.log("[move player]", id, x, y, missileType);
};



Game.winGame = function () {

    if (window.gameEnded) return;
    window.gameEnded = true;

    PurePopup.prompt({
        title: `<img src="assets/bmc-banner.jpg"><br><big>🥳 &nbsp; </big> &nbsp; V I C T O R Y ! &nbsp; <big> &nbsp; ✌️</big>`,
        buttons: {
            replay: "Play again",
        },
        inputs: {
        }
    }, function(result) {
        
        newVictory();
        reset();
    });
};




Game.looseGame = function () {

    if (window.gameEnded) return;
    window.gameEnded = true;

    PurePopup.prompt({
        title: `<img src="assets/bmc-banner.jpg"><br><big>👎 &nbsp; </big> &nbsp; D E F E A T &nbsp; <big> &nbsp; 💩</big>`,
        buttons: {
            replay: "Play again",
        },
        inputs: {
        }
    }, function(result) {
        
        reset();
    });
};


