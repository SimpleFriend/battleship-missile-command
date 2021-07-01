


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
    true: new PIXI.ParticleContainer(50, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    }),
    false: new PIXI.ParticleContainer(50, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    })
};

particles.tubeContainer = {
    true: new PIXI.ParticleContainer(50, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    }),
    false: new PIXI.ParticleContainer(50, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    })
};

particles.trailContainer = {
    true: new PIXI.ParticleContainer(50, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    }),
    false: new PIXI.ParticleContainer(50, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    })
};

particles.mainboomContainer = {
    true: new PIXI.ParticleContainer(50, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    }),
    false: new PIXI.ParticleContainer(50, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    })
};

particles.lineboomContainer = new PIXI.ParticleContainer(50, {
    scale: true,
    position: true,
    rotation: true,
    alpha: true,
});

particles.crosshairContainer = {
    true: new PIXI.ParticleContainer(50, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
    }),
    false: new PIXI.ParticleContainer(50, {
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

particles.burnContainer = new PIXI.ParticleContainer(36, {
    scale: true,
    position: true,
    rotation: true,
    alpha: true,
});



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



// text style

window.textStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    dropShadow: true,
    dropShadowBlur: 4,
    dropShadowColor: "#4000ff",
    dropShadowDistance: 0,
    fill: "white",
    fontSize: 20,
    align: "center"
});



// sprites scales

function scaleStuff() {

    window.gridScale = 0.4;
    window.bgScale = app.renderer.view.width / 1920;
    window.boatScale = gridScale * bgScale;
    window.missileScale = boatScale * 0.5;
    window.dotSqrDiameter = Math.sqr(seaPos(1, 0).x - seaPos(0, 0).x) * 2;
}



// grid to screen coordinates

function seaPos(ix, iy) {

    let x = Math.round(ix * 2) / 2;
    let y = Math.round(iy * 2) / 2;

    return {
        x: -95 + (x + 2) * gridScale / 1920 * 200 * 100,
        y: (y - 8) * gridScale / 1920 * 200 * 100
    };
}



// draw grid on screen

function buildGrid(blue) {

    particles.dotContainer[blue].removeChildren();

    if (blue) {

        for (let y = 0; y < gridH; ++y) for (let x = 0; x < gridW; ++x) {

            let pos = posGameToScreen(seaPos(x, y - 0.5));

            let skip = false;
            for (let boat of boatSprites[blue])
                for (let part of boat.parts)
                    if (part.x == x && part.y == y)
                        skip = true;

            if (skip) continue;

            let dot = new PIXI.Sprite(
                PIXI.loader.resources["assets/b-dot.png"].texture
            );
            dot.scale.x = boatScale;
            dot.scale.y = boatScale;
            dot.anchor.x = 0.5;
            dot.anchor.y = 0.5;
            dot.alpha = 0.5;

            Object.assign(dot, pos);

            dots['b-x'+x+'y'+y] = dot;

            particles.dotContainer[true].addChild(dot);
        }

    } else {

        for (let x = 0; x < gridW; ++x) for (let y = 0; y < gridH; ++y) {

            let dot = new PIXI.Sprite(
                PIXI.loader.resources["assets/r-dot.png"].texture
            );
            dot.scale.x = boatScale;
            dot.scale.y = boatScale;
            dot.anchor.x = 0.5;
            dot.anchor.y = 0.5;
            dot.alpha = 0.5;

            let pos = posGameToScreen(seaPos(x, y - 0.5));
            dot.x = app.renderer.view.width - pos.x;
            dot.y = pos.y;

            dots['r-x'+x+'y'+y] = dot;

            particles.dotContainer[false].addChild(dot);
        }
    }
}



// draw boats on screen

function displayBoats(pos, red) {

    boatSprites[true] = [];

    for (let ship of Object.keys(pos)) {

        boat = new PIXI.Sprite(
            PIXI.loader.resources[`assets/${red?'r':'b'}-${ship}.png`].texture
        );

        boat.blendMode = PIXI.BLEND_MODES.ADD;
        boat.scale.x = boatScale * (pos[ship].d < 2 && ship == "carrier" ? -1 : 1) * (red ? -1 : 1);
        boat.scale.y = boatScale * (red && ship == "submarine" && (pos[ship].d == 1 || pos[ship].d == 3 ) ? -1 : 1);
        boat.anchor.x = 0.5;
        boat.anchor.y = 0.5;

        boat.rotation = Math.PI / 2 * pos[ship].d;

        let offset = ship == "carrier" ? 0.5 : 0;
        let bpos = posGameToScreen(seaPos(offset + pos[ship].x, offset + pos[ship].y - 0.5));

        if (red) bpos.x = app.renderer.view.width - bpos.x;

        boat.parts = pos[ship].parts;

        Object.assign(boat, bpos);

        app.stage.addChild(boat);
        boatSprites[true].push(boat);

    }
}



function writeText(what, x, y) {
    
    let text = new PIXI.Text(what, window.textStyle);

    let pos = posGameToScreen({
        x: x,
        y: y
    });
    pos.y = Math.min(Math.max(20, pos.y), app.renderer.view.height - 20);
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
    Object.assign(text, pos);
    app.stage.addChild(text);        
}


function buildLaunchers(blue, launchers, name) {

    writeText(simplifyName(name), blue ? -50 : 50, -50);

    if (!blue) {

        writeText("← vs →", 0, -50);
        writeText(my.room, 0, 50);
        
        ++defeats; localStorage.setItem("BMC_Defeats", defeats);
    }

    for (let l = 0; l < launchers.length; ++l) {

        let launcher = new PIXI.Sprite(
            PIXI.loader.resources[`assets/${blue ? 'b' : 'r'}-launcher.png`].texture
        );

        launcher.scale.x = boatScale;
        launcher.scale.y = boatScale;
        launcher.anchor.x = 0.5;
        launcher.anchor.y = 0.5;

        let pos = posGameToScreen({
            x: blue ? -95 : 95,
            y: launchers[l]
        });
        Object.assign(launcher, { x: pos.x, y: pos.y });

        launcherPos[blue].push(pos);

        app.stage.addChild(launcher);
    }

    if (!blue) buildGrid(false);
}