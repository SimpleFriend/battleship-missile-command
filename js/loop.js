


function mainLoop(delta) {

    bg.x = app.renderer.view.width / 2;
    bg.y = app.renderer.view.height / 2;

    for (let entity of entities)
        for (let component in entity)
            if (tick[component])
                tick[component](entity, delta);

    if (collectGarbage) entities = entities.filter(entity => !entity.garbage);
    
    bgBrightness -= (bgBrightness - bgBaseBrightness) / 100;
    bgColorMatrix.brightness(bgBrightness);
}



// systems

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
    for (let boom of particles.mainboomContainer[!entity.blue].children) {
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
        particles.missileContainer[entity.blue].removeChild(entity.sprite);
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
        particles.mainboomContainer[entity.blue].removeChild(entity.sprite);
        particles.lineboomContainer.removeChild(entity.lineboom);
        particles.trailContainer[entity.blue].removeChild(entity.trail);
    }
}



