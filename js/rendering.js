


// hello pixi

PIXI.utils.sayHello(
    PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas"
);

var app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
});

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;

document.body.appendChild(app.view);



// particle containers for fast sprites

var particles = {};

particles.missileContainer = {
    true: new PIXI.ParticleContainer(100, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    }),
    false: new PIXI.ParticleContainer(100, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    })
};

particles.trailContainer = {
    true: new PIXI.ParticleContainer(100, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    }),
    false: new PIXI.ParticleContainer(100, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    })
};

particles.mainboomContainer = {
    true: new PIXI.ParticleContainer(100, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    }),
    false: new PIXI.ParticleContainer(100, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    })
};

particles.lineboomContainer = new PIXI.ParticleContainer(100, {
    scale: true,
    position: true,
    rotation: true,
    alpha: true,
});

particles.crosshairContainer = {
    true: new PIXI.ParticleContainer(100, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    }),
    false: new PIXI.ParticleContainer(100, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    })
};

particles.dotContainer = {
    true: new PIXI.ParticleContainer(gridW * gridH, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    }),
    false: new PIXI.ParticleContainer(gridW * gridH, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    })
};



// asset loader

PIXI.loader
    .add("assets/" + bgName + ".jpg")
    .add("assets/w-lineboom.png")

    .add("assets/r-battleship.png")
    .add("assets/r-big.png")
    .add("assets/r-carrier.png")
    .add("assets/r-destroyer.png")
    .add("assets/r-dot.png")
    .add("assets/r-double.png")
    .add("assets/r-drop.png")
    .add("assets/r-octo.png")
    .add("assets/r-particle20.png")
    .add("assets/r-particle40.png")
    .add("assets/r-particle60.png")
    .add("assets/r-particle80.png")
    .add("assets/r-particle100.png")
    .add("assets/r-pie.png")
    .add("assets/r-small.png")
    .add("assets/r-submarine.png")
    .add("assets/r-tube.png")
    .add("assets/r-unit.png")
    .add("assets/r-mainboom.png")
    .add("assets/r-crosshair.png")
    .add("assets/r-trail.png")
    .add("assets/r-launcher.png")
    .add("assets/r-line.png")

    .add("assets/b-battleship.png")
    .add("assets/b-big.png")
    .add("assets/b-carrier.png")
    .add("assets/b-destroyer.png")
    .add("assets/b-dot.png")
    .add("assets/b-double.png")
    .add("assets/b-drop.png")
    .add("assets/b-octo.png")
    .add("assets/b-particle20.png")
    .add("assets/b-particle40.png")
    .add("assets/b-particle60.png")
    .add("assets/b-particle80.png")
    .add("assets/b-particle100.png")
    .add("assets/b-pie.png")
    .add("assets/b-small.png")
    .add("assets/b-submarine.png")
    .add("assets/b-tube.png")
    .add("assets/b-unit.png")
    .add("assets/b-mainboom.png")
    .add("assets/b-crosshair.png")
    .add("assets/b-trail.png")
    .add("assets/b-launcher.png")
    .add("assets/b-line.png")

    .load(setup);



// sprites scales

function scaleSea(heightPercent) {

    seaScale = 1 / 100 * app.renderer.view.height * heightPercent / 8;
    boatScale = seaScale;
}



// grid to screen coordinates

function seaPos(x, y) {

    return {
        x: (x + 3) * 100 * seaScale,
        y: app.renderer.view.height / 2 + (y - (gridH - 1) / 2) * 100 * seaScale
    };
}



// draw grid on screen

function buildGrid(blue) {

    particles.dotContainer[blue].removeChildren();

    if (blue) {

        for (let y = 0; y < gridH; ++y) for (let x = 0; x < gridW; ++x) {

            let pos = seaPos(x, y);

            let skip = false;
            for (let boat of boatSprites[blue])
                for (let part of boat.parts)
                    if (part.x == x && part.y == y)
                        skip = true;

            if (skip) continue;

            let dot = new PIXI.Sprite(
                PIXI.loader.resources["assets/b-dot.png"].texture
            );
            dot.scale.x = seaScale;
            dot.scale.y = seaScale;
            dot.anchor.x = 0.5;
            dot.anchor.y = 0.5;

            Object.assign(dot, pos);

            particles.dotContainer[true].addChild(dot);
        }

    } else {

        for (let x = 0; x < gridW; ++x) for (let y = 0; y < gridH; ++y) {

            let dot = new PIXI.Sprite(
                PIXI.loader.resources["assets/r-dot.png"].texture
            );
            dot.scale.x = seaScale;
            dot.scale.y = seaScale;
            dot.anchor.x = 0.5;
            dot.anchor.y = 0.5;

            let pos = seaPos(x, y);
            dot.x = app.renderer.view.width - pos.x;
            dot.y = pos.y;

            particles.dotContainer[false].addChild(dot);
        }
    }
}



// draw boats on screen

function displayBoats(pos) {

    boatSprites[true] = [];



    boat = new PIXI.Sprite(
        PIXI.loader.resources["assets/b-carrier.png"].texture
    );

    boat.blendMode = PIXI.BLEND_MODES.ADD;
    boat.scale.x = boatScale * (pos.carrier.d < 2 ? -1 : 1);
    boat.scale.y = boatScale;
    boat.anchor.x = 0.5;
    boat.anchor.y = 0.5;

    boat.rotation = Math.PI / 2 * pos.carrier.d;

    let bpos = seaPos(0.5 + pos.carrier.x, 0.5 + pos.carrier.y);

    boat.parts = pos.carrier.parts;

    boat.x = bpos.x;
    boat.y = bpos.y;

    app.stage.addChild(boat);
    boatSprites[true].push(boat);



    boat = new PIXI.Sprite(
        PIXI.loader.resources["assets/b-submarine.png"].texture
    );

    boat.blendMode = PIXI.BLEND_MODES.ADD;
    boat.scale.x = boatScale * (pos.submarine.d < 2 ? -1 : 1);
    boat.scale.y = boatScale;
    boat.anchor.x = 0.5;
    boat.anchor.y = 0.5;

    boat.rotation = Math.PI / 2 * pos.submarine.d;

    bpos = seaPos(pos.submarine.x, pos.submarine.y);

    boat.parts = pos.submarine.parts;

    boat.x = bpos.x;
    boat.y = bpos.y;

    app.stage.addChild(boat);
    boatSprites[true].push(boat);



    boat = new PIXI.Sprite(
        PIXI.loader.resources["assets/b-destroyer.png"].texture
    );

    boat.blendMode = PIXI.BLEND_MODES.ADD;
    boat.scale.x = boatScale * (pos.destroyer.d < 2 ? -1 : 1);
    boat.scale.y = boatScale;
    boat.anchor.x = 0.5;
    boat.anchor.y = 0.5;

    boat.rotation = Math.PI / 2 * pos.destroyer.d;

    bpos = seaPos(pos.destroyer.x, pos.destroyer.y);

    boat.parts = pos.destroyer.parts;

    boat.x = bpos.x;
    boat.y = bpos.y;

    app.stage.addChild(boat);
    boatSprites[true].push(boat);



    boat = new PIXI.Sprite(
        PIXI.loader.resources["assets/b-battleship.png"].texture
    );

    boat.blendMode = PIXI.BLEND_MODES.ADD;
    boat.scale.x = boatScale * (pos.battleship.d < 2 ? -1 : 1);
    boat.scale.y = boatScale;
    boat.anchor.x = 0.5;
    boat.anchor.y = 0.5;

    boat.rotation = Math.PI / 2 * pos.battleship.d;

    bpos = seaPos(pos.battleship.x, pos.battleship.y);

    boat.parts = pos.battleship.parts;

    boat.x = bpos.x;
    boat.y = bpos.y;

    app.stage.addChild(boat);
    boatSprites[true].push(boat);
}


