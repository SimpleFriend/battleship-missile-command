const Vector = Victor;
var collectGarbage;

var globalScale = 0.2;
var seaScale;
var boatScale;
var gridW = 6;
var gridH = 18;

Math.sqr = function(x) { return x*x; }


let type = "WebGL";

if (!PIXI.utils.isWebGLSupported()) {

    type = "canvas";
}

PIXI.utils.sayHello(type);



function dirxy(x, y) {
    var d = Math.atan2(x, y) * (180 / Math.PI);
    if (d < 0) { d = 180 - d; }
    return d;
}




let app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
});

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;

document.body.appendChild(app.view);




var missileContainer = {
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

var trailContainer = {
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

var mainboomContainer = {
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

var lineboomContainer = new PIXI.ParticleContainer(100, {
    scale: true,
    position: true,
    rotation: true,
    alpha: true,
});

var crosshairContainer = {
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

var dotContainer = {
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



let bgColorMatrix;
let bgBrightness = 1;
let bgWidth = 1920;
let bgName = "synthwave";
let bgBaseBrightness = 0.5;



PIXI.loader
    .add("images/"+bgName+".jpg")
    .add("images/w-lineboom.png")

    .add("images/r-battleship.png")
    .add("images/r-big.png")
    .add("images/r-carrier.png")
    .add("images/r-destroyer.png")
    .add("images/r-dot.png")
    .add("images/r-double.png")
    .add("images/r-drop.png")
    .add("images/r-octo.png")
    .add("images/r-particle20.png")
    .add("images/r-particle40.png")
    .add("images/r-particle60.png")
    .add("images/r-particle80.png")
    .add("images/r-particle100.png")
    .add("images/r-pie.png")
    .add("images/r-small.png")
    .add("images/r-submarine.png")
    .add("images/r-tube.png")
    .add("images/r-unit.png")
    .add("images/r-mainboom.png")
    .add("images/r-crosshair.png")
    .add("images/r-trail.png")
    .add("images/r-launcher.png")
    .add("images/r-line.png")

    .add("images/b-battleship.png")
    .add("images/b-big.png")
    .add("images/b-carrier.png")
    .add("images/b-destroyer.png")
    .add("images/b-dot.png")
    .add("images/b-double.png")
    .add("images/b-drop.png")
    .add("images/b-octo.png")
    .add("images/b-particle20.png")
    .add("images/b-particle40.png")
    .add("images/b-particle60.png")
    .add("images/b-particle80.png")
    .add("images/b-particle100.png")
    .add("images/b-pie.png")
    .add("images/b-small.png")
    .add("images/b-submarine.png")
    .add("images/b-tube.png")
    .add("images/b-unit.png")
    .add("images/b-mainboom.png")
    .add("images/b-crosshair.png")
    .add("images/b-trail.png")
    .add("images/b-launcher.png")
    .add("images/b-line.png")

    .load(setup);





var entities = [];



function scaleSea(heightPercent) {

    seaScale = 1 / 100 * app.renderer.view.height * heightPercent / 7;
    boatScale = seaScale / 1;
}


function seaPos(x, y) {

    return {
        x: (x + 3) * 100 * seaScale,
        y: app.renderer.view.height / 2 + (y - (gridH -1) / 2) * 100 * seaScale
    };
}


function buildGrid() {


    for (let x = 0; x < gridW; ++x)
        for (let y = 0; y < gridH; ++y) {

            let dot = new PIXI.Sprite(
                PIXI.loader.resources["images/b-dot.png"].texture
            );
            dot.scale.x = seaScale;
            dot.scale.y = seaScale;
            dot.anchor.x = 0.5;
            dot.anchor.y = 0.5;

            let pos = seaPos(x, y);
            Object.assign(dot, pos);

            //console.log(dot.x + " - " + dot.y);
            dotContainer[true].addChild(dot);
        }

        for (let x = 0; x < gridW; ++x)
            for (let y = 0; y < gridH; ++y) {
    
                let dot = new PIXI.Sprite(
                    PIXI.loader.resources["images/r-dot.png"].texture
                );
                dot.scale.x = seaScale;
                dot.scale.y = seaScale;
                dot.anchor.x = 0.5;
                dot.anchor.y = 0.5;
    
                let pos = seaPos(x, y);
                dot.x = app.renderer.view.width - pos.x;
                dot.y = pos.y;
    
                //console.log(dot.x + " - " + dot.y);
                dotContainer[false].addChild(dot);
            }
}


scaleSea(0.333);

function setup() {


    bg = new PIXI.Sprite(
        PIXI.loader.resources["images/"+bgName+".jpg"].texture
    );
    
    bgColorMatrix = new PIXI.filters.ColorMatrixFilter();

    bg.filters = [bgColorMatrix];
    //colorMatrix.contrast(2);
    bgColorMatrix.brightness(bgBrightness);

    bg.scale = {x: app.renderer.view.width / bgWidth, y: app.renderer.view.width / bgWidth };
    bg.anchor = { x: 0.5, y: 0.5 };
    bg.x = app.renderer.view.width / 2;
    bg.y = app.renderer.view.height / 2;

    app.stage.addChild(bg);






/*

    boat = new PIXI.Sprite(
        PIXI.loader.resources["images/b-carrier.png"].texture
    );

    boat.blendMode = PIXI.BLEND_MODES.ADD;
    boat.scale.x = boatScale;
    boat.scale.y = boatScale;
    boat.anchor.x = 0.5;
    boat.anchor.y = 0.5;

    let bpos = seaPos(2.5, 2.5);

    boat.x = bpos.x;
    boat.y = bpos.y;

    app.stage.addChild(boat);


    

    boat = new PIXI.Sprite(
        PIXI.loader.resources["images/r-carrier.png"].texture
    );

    boat.blendMode = PIXI.BLEND_MODES.ADD;
    boat.scale.x = boatScale;
    boat.scale.y = boatScale;
    boat.anchor.x = 0.5;
    boat.anchor.y = 0.5;

    bpos = seaPos(2.5, 2.5);

    boat.x = app.renderer.view.width - bpos.x;
    boat.y = bpos.y;

    app.stage.addChild(boat);

*/






    app.stage.addChild(trailContainer[false]);
    app.stage.addChild(missileContainer[false]);
    app.stage.addChild(mainboomContainer[false]);
    app.stage.addChild(crosshairContainer[false]);

    app.stage.addChild(trailContainer[true]);
    app.stage.addChild(missileContainer[true]);
    app.stage.addChild(mainboomContainer[true]);
    app.stage.addChild(crosshairContainer[true]);

    app.stage.addChild(lineboomContainer);
    app.stage.addChild(dotContainer[false]);
    app.stage.addChild(dotContainer[true]);    
    
    buildGrid();




    for (let l = 0; l < 3; ++l) {

        let launcher = new PIXI.Sprite(
            PIXI.loader.resources["images/b-launcher.png"].texture
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
            PIXI.loader.resources["images/r-launcher.png"].texture
        );
    
        launcher.scale.x = boatScale;
        launcher.scale.y = boatScale;
        launcher.anchor.x = 0.5;
        launcher.anchor.y = 0.5;
    
        launcher.x = app.renderer.view.width - seaPos(-2, 0.5 + l * 8).x;
        launcher.y = seaPos(0, 0.5 + l * 8).y;
        
    
        app.stage.addChild(launcher);
    }







    bg.interactive = true;

    bg.on("mousedown", function (e) {

        //console.log('Mouse clicked');
        //console.log('X', e.data.global.x, 'Y', e.data.global.y);

        newMissile(e.data.global.x, e.data.global.y, seaPos(-1.6, 0.5 + Math.floor(3 * Math.random()) * 8).x, seaPos(-2, 0.5 + Math.floor(3 * Math.random()) * 8).y, 8, 1, true);
    })


    app.ticker.add(delta => mainLoop(delta));
}




function newMissile(targetX, targetY, originX, originY, velocity, size, blue) {

    let entity = {
        position: { x: originX, y: originY },
        target: { x: targetX, y: targetY },
        velocity: velocity,
        sprite: PIXI.Sprite.from(blue ? "images/b-small.png" : "images/r-small.png"),
        trail: new PIXI.Sprite(
            PIXI.loader.resources[blue ? "images/b-trail.png" :  "images/r-trail.png"].texture
        ),
        crosshair: newBoom(targetX, targetY, size, blue),
        blue: blue
    };
    entities.push(entity);
    entity.sprite.x = originX;
    entity.sprite.y = originY;
    entity.sprite.anchor.x = 0.5;
    entity.sprite.anchor.y = 0.5;
/*
    let colorMatrix = new PIXI.filters.ColorMatrixFilter();
    entity.sprite.filters = [colorMatrix];
    if (entity.blue) colorMatrix.toBGR();
*/
    entity.sprite.scale.x = globalScale * size;
    entity.sprite.scale.y = globalScale * size;
    missileContainer[blue].addChild(entity.sprite);

    entity.trail.blendMode = PIXI.BLEND_MODES.ADD;
    //entity.trail.filters = [colorMatrix];
    entity.trail.x = originX;
    entity.trail.y = originY;
    entity.trail.anchor.x = 0.5;
    entity.trail.anchor.y = 1;
    entity.trail.scale.x = globalScale * size * 2;
    entity.trail.scale.y = 0;
    //entity.trail.alpha = 0.75;
    trailContainer[blue].addChild(entity.trail);

}



function newBoom(x, y, size, blue) {

    let entity = {
        position: { x: x, y: y },
        maxsize: size,
        sprite: new PIXI.Sprite(
            PIXI.loader.resources[!blue ? "images/r-crosshair.png" : "images/b-crosshair.png"].texture
        ),
        blue: blue
    };
    entity.sprite.blendMode = PIXI.BLEND_MODES.ADD;
    entity.sprite.x = x;
    entity.sprite.y = y;
    entity.sprite.anchor.x = 0.5;
    entity.sprite.anchor.y = 0.5;
    entity.sprite.alpha = 0.75;
/*
    let colorMatrix = new PIXI.filters.ColorMatrixFilter();
    entity.sprite.filters = [colorMatrix];
    if (entity.blue) colorMatrix.toBGR();
*/
    entity.sprite.scale.x = globalScale;
    entity.sprite.scale.y = globalScale;
    entities.push(entity);
    crosshairContainer[!blue].addChild(entity.sprite);

    return entity;
}



function makeCrossBoom(entity) {

    bgBrightness += entity.maxsize / 3;

    crosshairContainer[!entity.blue].removeChild(entity.sprite);
    entity.sprite = new PIXI.Sprite(
        PIXI.loader.resources[entity.blue ? "images/b-mainboom.png" : "images/r-mainboom.png"].texture
    );
    entity.sprite.blendMode = PIXI.BLEND_MODES.ADD;
    entity.size = 0;
    entity.growing = 0.03;
    entity.sprite.x = entity.position.x;
    entity.sprite.y = entity.position.y;
    entity.sprite.anchor.x = 0.5;
    entity.sprite.anchor.y = 0.5;
    entity.sprite.scale.x = globalScale * entity.size;
    entity.sprite.scale.y = globalScale * entity.size;
    entity.sprite.alpha = 0.75;
    mainboomContainer[entity.blue].addChild(entity.sprite);
/*
    let colorMatrix = new PIXI.filters.ColorMatrixFilter();
    entity.sprite.filters = [colorMatrix];
    if (entity.blue) colorMatrix.toBGR();
*/
    entity.lineboom = new PIXI.Sprite(
        PIXI.loader.resources["images/w-lineboom.png"].texture
    );
    entity.lineboom.blendMode = PIXI.BLEND_MODES.ADD;
    entity.lineboom.x = entity.position.x;
    entity.lineboom.y = entity.position.y;
    entity.lineboom.anchor.x = 0.5;
    entity.lineboom.anchor.y = 0.5;
    entity.lineboom.scale.x = globalScale * entity.size;
    entity.lineboom.scale.y = globalScale * entity.size;
    entity.lineboom.alpha = 0.75;
    lineboomContainer.addChild(entity.lineboom);

}


var sec = 0;

function mainLoop(delta) {

    bg.x = app.renderer.view.width / 2;
    bg.y = app.renderer.view.height / 2;

    for (let entity of entities)
        for (let component in entity)
            if (tick[component])
                tick[component](entity, delta);

    if (collectGarbage) entities = entities.filter(entity => !entity.garbage);

    if (Math.random() > 0.99)
        newMissile(app.renderer.view.width * Math.random(), app.renderer.view.height * Math.random(), seaPos(-1.6, 0.5 + Math.floor(3 * Math.random()) * 8).x, seaPos(-2, 0.5 + Math.floor(3 * Math.random()) * 8).y, 4 + 4 * Math.random(), 0.5 + Math.random(), true);

    if (Math.random() > 0.995) {

        sec = 0;
        let target = seaPos(Math.floor(6 * Math.random()), Math.floor(18 * Math.random()));
        let origin = seaPos(Math.floor(6 * Math.random()), Math.floor(18 * Math.random()));
        newMissile(target.x, target.y,
            app.renderer.view.width - seaPos(-1.6, 0.5 + Math.floor(3 * Math.random()) * 8).x, seaPos(-2, 0.5 + Math.floor(3 * Math.random()) * 8).y,
            0.5 + 3.5 * Math.random(), 0.5 + Math.random(), false);
    }

    bgBrightness -= (bgBrightness - bgBaseBrightness) / 100;
    bgColorMatrix.brightness(bgBrightness);
}



var tick = {};



tick.velocity = function (entity, delta) {

    let spritePos = new Vector(entity.sprite.x, entity.sprite.y);
    let targetPos = new Vector(entity.target.x, entity.target.y);

    if (!entity.target.move) {
        entity.target.direction = targetPos.clone().subtract(spritePos).horizontalAngle() + Math.PI / 2;
        entity.target.move = new Vector(0, entity.velocity).clone().rotate(entity.target.direction);
        entity.sprite.rotation = entity.target.direction;
        entity.trail.rotation = entity.target.direction;
        entity.target.distance = 9999;
    }

    let bingo = false;
    for (let boom of mainboomContainer[!entity.blue].children) {
        if (spritePos.distance(new Vector(boom.x, boom.y)) < boom.width / 2) {
            bingo = true;
            break;
        }
    }
    let currentDistance = spritePos.distance(targetPos);
    if (bingo || currentDistance > entity.target.distance) {
        entity.garbage = true;
        if (bingo) {
            entity.crosshair.maxsize /= 2;
            entity.crosshair.position = { x: entity.sprite.x, y: entity.sprite.y };
        }
        makeCrossBoom(entity.crosshair);
        entity.crosshair.trail = entity.trail;
        collectGarbage = true;
        missileContainer[entity.blue].removeChild(entity.sprite);
    }
    entity.target.distance = currentDistance;

    entity.trail.scale.y = new Vector(entity.position.x, entity.position.y).distance(spritePos) / 2;

    entity.sprite.x -= entity.target.move.x * delta;
    entity.sprite.y -= entity.target.move.y * delta;
}



tick.lineboom = function (entity, delta) {

    if (entity.size > entity.maxsize) entity.growing = -entity.growing;

    entity.size += entity.growing;

    if (entity.growing > 0) {
        let v = new Vector(0, Math.random() * (entity.maxsize - entity.size) * 5);
        v = v.rotate(Math.random() * Math.PI * 2);

        //bg.x = app.renderer.view.width / 2 + (Math.random() - Math.random()) * (entity.maxsize - entity.size) * 5;
        //bg.y = app.renderer.view.height / 2 + (Math.random() - Math.random()) * (entity.maxsize - entity.size) * 5;
        bg.x += v.x;
        bg.y += v.y;
    }
    
    entity.sprite.scale.x = globalScale * Math.sqrt(entity.size * 5);
    entity.sprite.scale.y = globalScale * Math.sqrt(entity.size * 5);


    if (Math.random() > 0.5) {

        entity.lineboom.x = entity.sprite.x + (Math.random() - 0.5) * entity.size * 10;
        entity.lineboom.y = entity.sprite.y + (Math.random() - 0.5) * entity.size * 10;
    
        entity.lineboom.scale.x = globalScale * Math.sqrt(entity.size * 5) + (3 * Math.random() - 1) * 0.04;
        entity.lineboom.scale.y = globalScale * Math.sqrt(entity.size * 5) + (3 * Math.random() - 1) * 0.04;
    
        entity.lineboom.rotation = Math.random() * Math.PI * 2;
    }

    entity.trail.alpha -= delta * 0.03;

    if (entity.size <= 0) {
        entity.garbage = true;
        collectGarbage = true;
        mainboomContainer[entity.blue].removeChild(entity.sprite);
        lineboomContainer.removeChild(entity.lineboom);
        trailContainer[entity.blue].removeChild(entity.trail);
    }
}








/*



    sprite.x = 50;
    sprite.y = 50;

    sprite.scale.x = 0.2;
    sprite.scale.y = 0.2;

    sprite.anchor.set(0.5, 0.5);

    sprite.rotation = -0.5;

    app.stage.addChild(sprite);

*/