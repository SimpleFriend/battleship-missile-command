
function setup() {

    bg = new PIXI.Sprite(
        PIXI.loader.resources["assets/" + bgName + ".jpg"].texture
    );

    bgColorMatrix = new PIXI.filters.ColorMatrixFilter();

    bg.filters = [bgColorMatrix];
    //colorMatrix.contrast(2);
    bgColorMatrix.brightness(bgBrightness);

    bg.scale = { x: app.renderer.view.width / bgWidth, y: app.renderer.view.width / bgWidth };
    bg.anchor = { x: 0.5, y: 0.5 };
    bg.x = app.renderer.view.width / 2;
    bg.y = app.renderer.view.height / 2;

    app.stage.addChild(bg);

    scaleStuff();


    app.stage.addChild(particles.burnContainer);

    app.stage.addChild(particles.trailContainer[false]);
    app.stage.addChild(particles.tubeContainer[false]);
    app.stage.addChild(particles.missileContainer[false]);
    app.stage.addChild(particles.mainboomContainer[false]);
    app.stage.addChild(particles.crosshairContainer[false]);

    app.stage.addChild(particles.trailContainer[true]);
    app.stage.addChild(particles.tubeContainer[true]);
    app.stage.addChild(particles.missileContainer[true]);
    app.stage.addChild(particles.mainboomContainer[true]);
    app.stage.addChild(particles.crosshairContainer[true]);

    app.stage.addChild(particles.lineboomContainer);
    app.stage.addChild(particles.dotContainer[false]);
    app.stage.addChild(particles.dotContainer[true]);






    //playerName = window.prompt("Player Name", playerName);
    //roomName = window.prompt("Room Name\n(leave empty to join any room)", roomName) || '';


    let go = () => {

        fleetPos = placeFleet();

        Client.askNewPlayer(playerName, fleetPos, roomName);
    
        bg.interactive = true;
    
        bg.on("mousedown", function (e) {

            let nuke = checkNuke({ x: e.data.global.x, y: e.data.global.y });
            let pos = nuke ?
                posGameToScreen(seaPos(nuke.x, nuke.y - 0.5)) :
                { x: e.data.global.x, y: e.data.global.y };
            if (nuke) pos.x = app.renderer.view.width - pos.x;
            Client.sendClick(
                posScreenToGame(pos),
                nuke
            );
        });
    
        app.ticker.add(delta => mainLoop(delta));
    }


    PurePopup.prompt({
        title: `<img src="assets/bmc-banner.jpg">`,
        buttons: {
            specRoom: "Join a specific room",
            anyRoom: "Join any room",
        },
        inputs: {
            playerName: `<span id="who">Connected Players:</span><br>Please, enter your name`,
        }
    }, function(result) {
        
        playerName = result.playerName;
        localStorage.setItem("BMC_PlayerName", playerName);

        if (result.confirm == "specRoom") {

            PurePopup.prompt({
                title: `<img src="assets/room.jpg">`,
                buttons: {
                    cancelButton: 'Cancel',
                    okButton: 'Continue'
                },
                inputs: {
                    roomName: 'Room',                }
                },
                function(result) {

                    if (result.confirm == "okButton") roomName = result.roomName;
                    go();
                }
            );

        } else go();

    });

    setTimeout(() => {
        document.getElementById("purePopupInputs_playerName").value = playerName;
        Client.who();
    }, 250);

}




function reset() {

    window.location.reload(false);
}