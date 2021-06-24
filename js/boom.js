



// fire a new missile

function newMissile(targetX, targetY, originX, originY, velocity, size, blue) {

    let entity = {
        position: { x: originX, y: originY },
        target: { x: targetX, y: targetY },
        velocity: velocity,
        sprite: PIXI.Sprite.from(blue ? "assets/b-small.png" : "assets/r-small.png"),
        trail: new PIXI.Sprite(
            PIXI.loader.resources[blue ? "assets/b-trail.png" : "assets/r-trail.png"].texture
        ),
        crosshair: newBoom(targetX, targetY, size, blue),
        blue: blue
    };
    entities.push(entity);
    entity.sprite.x = originX;
    entity.sprite.y = originY;
    entity.sprite.anchor.x = 0.5;
    entity.sprite.anchor.y = 0.5;

    entity.sprite.scale.x = globalScale * size;
    entity.sprite.scale.y = globalScale * size;
    particles.missileContainer[blue].addChild(entity.sprite);

    entity.trail.blendMode = PIXI.BLEND_MODES.ADD;
    entity.trail.x = originX;
    entity.trail.y = originY;
    entity.trail.anchor.x = 0.5;
    entity.trail.anchor.y = 1;
    entity.trail.scale.x = globalScale * size * 2;
    entity.trail.scale.y = 0;
    //entity.trail.alpha = 0.75;
    particles.trailContainer[blue].addChild(entity.trail);

}



// place a crosshair

function newBoom(x, y, size, blue) {

    let entity = {
        position: { x: x, y: y },
        maxsize: size,
        sprite: new PIXI.Sprite(
            PIXI.loader.resources[!blue ? "assets/r-crosshair.png" : "assets/b-crosshair.png"].texture
        ),
        blue: blue
    };
    entity.sprite.blendMode = PIXI.BLEND_MODES.ADD;
    entity.sprite.x = x;
    entity.sprite.y = y;
    entity.sprite.anchor.x = 0.5;
    entity.sprite.anchor.y = 0.5;
    entity.sprite.alpha = 0.75;

    entity.sprite.scale.x = globalScale;
    entity.sprite.scale.y = globalScale;
    entities.push(entity);
    particles.crosshairContainer[!blue].addChild(entity.sprite);

    return entity;
}



// turn crosshair into boom

function makeCrossBoom(entity) {

    bgBrightness += entity.maxsize / 3;

    particles.crosshairContainer[!entity.blue].removeChild(entity.sprite);
    entity.sprite = new PIXI.Sprite(
        PIXI.loader.resources[entity.blue ? "assets/b-mainboom.png" : "assets/r-mainboom.png"].texture
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
    particles.mainboomContainer[entity.blue].addChild(entity.sprite);

    entity.lineboom = new PIXI.Sprite(
        PIXI.loader.resources["assets/w-lineboom.png"].texture
    );
    entity.lineboom.blendMode = PIXI.BLEND_MODES.ADD;
    entity.lineboom.x = entity.position.x;
    entity.lineboom.y = entity.position.y;
    entity.lineboom.anchor.x = 0.5;
    entity.lineboom.anchor.y = 0.5;
    entity.lineboom.scale.x = globalScale * entity.size;
    entity.lineboom.scale.y = globalScale * entity.size;
    entity.lineboom.alpha = 0.75;
    particles.lineboomContainer.addChild(entity.lineboom);
}


