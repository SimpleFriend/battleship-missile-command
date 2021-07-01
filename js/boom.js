



// fire a new missile

function tmpCrossHair(targetX, targetY, blue, mid) {

    newBoom(targetX, targetY, 1, blue, true, mid);
}



// fire a new missile

function newMissile(targetX, targetY, originX, originY, velocity, size, blue, missileType, mid, nuke) {

    blue = !!blue;

    let missile = missileType == "solair" ? "small" : "tube";

    let entity = {
        position: { x: originX, y: originY },
        target: { x: targetX, y: targetY },
        velocity: velocity,
        sprite: PIXI.Sprite.from(`assets/${blue?'b':'r'}-${missile}.png`),
        trail: new PIXI.Sprite(
            PIXI.loader.resources[blue ? "assets/b-trail.png" : "assets/r-trail.png"].texture
        ),
        crosshair: newBoom(targetX, targetY, size, blue, false, mid, nuke),
        blue: blue,
        type: missileType
    };
    entities.push(entity);
    entity.sprite.x = originX;
    entity.sprite.y = originY;
    entity.sprite.anchor.x = 0.5;
    entity.sprite.anchor.y = 0.5;

    entity.sprite.scale.x = missileScale * size;
    entity.sprite.scale.y = missileScale * size;
    (missileType == "solair" ?
        particles.missileContainer :
        particles.tubeContainer
        )[blue].addChild(entity.sprite);

    entity.trail.blendMode = PIXI.BLEND_MODES.ADD;
    entity.trail.x = originX;
    entity.trail.y = originY;
    entity.trail.anchor.x = 0.5;
    entity.trail.anchor.y = 1;
    entity.trail.scale.x = missileScale * size * 2;
    entity.trail.scale.y = 0;
    //entity.trail.alpha = 0.75;
    particles.trailContainer[blue].addChild(entity.trail);

}



// place a crosshair

function newBoom(x, y, size, blue, tmp, mid, nuke) {

    let entity = {
        position: { x: x, y: y },
        maxsize: size,
        sprite: new PIXI.Sprite(
            PIXI.loader.resources[!blue ? "assets/r-crosshair.png" : "assets/b-crosshair.png"].texture
        ),
        blue: blue,
        nuke: nuke
    };
    entity.sprite.blendMode = PIXI.BLEND_MODES.ADD;
    entity.sprite.x = x;
    entity.sprite.y = y;
    entity.sprite.anchor.x = 0.5;
    entity.sprite.anchor.y = 0.5;
    entity.sprite.alpha = tmp ? 0.25 : 0.75;
    entity.sprite.rotation = tmp ? Math.PI / 4 : 0;

    entity.sprite.scale.x = missileScale;
    entity.sprite.scale.y = missileScale;
    if (!tmp) entities.push(entity);
    entity.sprite.mid = mid;
    particles.crosshairContainer[!blue].addChild(entity.sprite);

    if (tmpCrossHairs[mid]) {

        tmpCrossHairs[mid].container.removeChild(tmpCrossHairs[mid].sprite);

    } else {

        tmpCrossHairs[mid] = {
            container: particles.crosshairContainer[!blue],
            sprite: entity.sprite
        };
    }

    return entity;
}



// turn crosshair into boom

function makeCrossBoom(entity) {

    bgBrightness += entity.maxsize / 10 / bgScale;

    Client.boom(entity.sprite.mid, entity.position.x, entity.position.y, entity.nuke);

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
    entity.sprite.scale.x = missileScale * entity.size;
    entity.sprite.scale.y = missileScale * entity.size;
    entity.sprite.alpha = 0.75;
    console.log(entity);
    particles.mainboomContainer[entity.blue].addChild(entity.sprite);

    entity.lineboom = new PIXI.Sprite(
        PIXI.loader.resources["assets/w-lineboom.png"].texture
    );
    entity.lineboom.blendMode = PIXI.BLEND_MODES.ADD;
    entity.lineboom.x = entity.position.x;
    entity.lineboom.y = entity.position.y;
    entity.lineboom.anchor.x = 0.5;
    entity.lineboom.anchor.y = 0.5;
    entity.lineboom.scale.x = missileScale * entity.size;
    entity.lineboom.scale.y = missileScale * entity.size;
    entity.lineboom.alpha = 0.75;
    particles.lineboomContainer.addChild(entity.lineboom);
}


