
function setup() {


    scaleSea(0.333);

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





    app.stage.addChild(particles.trailContainer[false]);
    app.stage.addChild(particles.missileContainer[false]);
    app.stage.addChild(particles.mainboomContainer[false]);
    app.stage.addChild(particles.crosshairContainer[false]);

    app.stage.addChild(particles.trailContainer[true]);
    app.stage.addChild(particles.missileContainer[true]);
    app.stage.addChild(particles.mainboomContainer[true]);
    app.stage.addChild(particles.crosshairContainer[true]);

    app.stage.addChild(particles.lineboomContainer);
    app.stage.addChild(particles.dotContainer[false]);
    app.stage.addChild(particles.dotContainer[true]);





    for (let l = 0; l < 3; ++l) {

        let launcher = new PIXI.Sprite(
            PIXI.loader.resources["assets/b-launcher.png"].texture
        );

        launcher.scale.x = boatScale;
        launcher.scale.y = boatScale;
        launcher.anchor.x = 0.5;
        launcher.anchor.y = 0.5;

        launcher.x = seaPos(-2, 0.5 + l * 8).x;
        launcher.y = seaPos(0, 0.5 + l * 8).y;


        app.stage.addChild(launcher);
    }





    for (let l = 0; l < 3; ++l) {

        let launcher = new PIXI.Sprite(
            PIXI.loader.resources["assets/r-launcher.png"].texture
        );

        launcher.scale.x = boatScale;
        launcher.scale.y = boatScale;
        launcher.anchor.x = 0.5;
        launcher.anchor.y = 0.5;

        launcher.x = app.renderer.view.width - seaPos(-2, 0.5 + l * 8).x;
        launcher.y = seaPos(0, 0.5 + l * 8).y;


        app.stage.addChild(launcher);
    }



    playerName = window.prompt("Player Name", playerName);

    fleetPos = placeFleet();

    buildGrid(false);

    Client.askNewPlayer(playerName, fleetPos);



    bg.interactive = true;

    bg.on("mousedown", function (e) {

        Client.sendClick(e.data.global.x, e.data.global.y);
    });


    app.ticker.add(delta => mainLoop(delta));
}
