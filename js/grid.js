


// ask player to validate ships locations

function placeFleet() {

    let confirmed = false;

    while (!confirmed) {

        for (let boat of boatSprites[true]) app.stage.removeChild(boat);

        displayBoats(placeShips());
        buildGrid(true);

        app.ticker.update();

        confirmed = window.confirm("Confirm fleet");
    }
}



// controlled random layout

function placeShips() {

    let needPlacement = true;
    let pos = {};
    let grid;

    while (needPlacement) {

        grid = new Array(18).fill(new Array(6).fill(false));



        let d = rnd(4);
        pos.carrier = (d == 0 || d == 2) ? { // horizontal
            x: rnd(3) + 1,
            y: rnd(17) + 0,
            d: d,
        } : { // vertical
            x: rnd(5) + 0,
            y: rnd(15) + 1,
            d: d,
        };

        if (pos.carrier.d == 0) pos.carrier.parts = [
            { x: pos.carrier.x - 1, y: pos.carrier.y + 0 },
            { x: pos.carrier.x + 0, y: pos.carrier.y + 0 },
            { x: pos.carrier.x + 1, y: pos.carrier.y + 0 },
            { x: pos.carrier.x + 0, y: pos.carrier.y + 1 },
            { x: pos.carrier.x + 1, y: pos.carrier.y + 1 },
            { x: pos.carrier.x + 2, y: pos.carrier.y + 1 },
        ];

        if (pos.carrier.d == 1) pos.carrier.parts = [
            { x: pos.carrier.x + 0, y: pos.carrier.y + 0 },
            { x: pos.carrier.x + 0, y: pos.carrier.y + 1 },
            { x: pos.carrier.x + 0, y: pos.carrier.y + 2 },
            { x: pos.carrier.x + 1, y: pos.carrier.y - 1 },
            { x: pos.carrier.x + 1, y: pos.carrier.y + 0 },
            { x: pos.carrier.x + 1, y: pos.carrier.y + 1 },
        ];

        if (pos.carrier.d == 2) pos.carrier.parts = [
            { x: pos.carrier.x - 1, y: pos.carrier.y + 1 },
            { x: pos.carrier.x + 0, y: pos.carrier.y + 1 },
            { x: pos.carrier.x + 1, y: pos.carrier.y + 1 },
            { x: pos.carrier.x + 0, y: pos.carrier.y + 0 },
            { x: pos.carrier.x + 1, y: pos.carrier.y + 0 },
            { x: pos.carrier.x + 2, y: pos.carrier.y + 0 },
        ];

        if (pos.carrier.d == 3) pos.carrier.parts = [
            { x: pos.carrier.x + 1, y: pos.carrier.y + 0 },
            { x: pos.carrier.x + 1, y: pos.carrier.y + 1 },
            { x: pos.carrier.x + 1, y: pos.carrier.y + 2 },
            { x: pos.carrier.x + 0, y: pos.carrier.y - 1 },
            { x: pos.carrier.x + 0, y: pos.carrier.y + 0 },
            { x: pos.carrier.x + 0, y: pos.carrier.y + 1 },
        ];



        d = rnd(4);
        pos.submarine = (d == 0 || d == 2) ? { // horizontal
            x: rnd(4) + 1,
            y: rnd(17) + (d == 0 ? 0 : 1),
            d: d,
        } : { // vertical
            x: rnd(5) + (d == 1 ? 1 : 0),
            y: rnd(16) + 1,
            d: d,
        };

        if (pos.submarine.d == 0) pos.submarine.parts = [
            { x: pos.submarine.x - 1, y: pos.submarine.y + 0 },
            { x: pos.submarine.x + 0, y: pos.submarine.y + 0 },
            { x: pos.submarine.x + 1, y: pos.submarine.y + 0 },
            { x: pos.submarine.x + 0, y: pos.submarine.y + 1 },
        ];

        if (pos.submarine.d == 1) pos.submarine.parts = [
            { x: pos.submarine.x - 1, y: pos.submarine.y + 0 },
            { x: pos.submarine.x + 0, y: pos.submarine.y - 1 },
            { x: pos.submarine.x + 0, y: pos.submarine.y + 0 },
            { x: pos.submarine.x + 0, y: pos.submarine.y + 1 },
        ];

        if (pos.submarine.d == 2) pos.submarine.parts = [
            { x: pos.submarine.x - 1, y: pos.submarine.y + 0 },
            { x: pos.submarine.x + 0, y: pos.submarine.y + 0 },
            { x: pos.submarine.x + 1, y: pos.submarine.y + 0 },
            { x: pos.submarine.x + 0, y: pos.submarine.y - 1 },
        ];

        if (pos.submarine.d == 3) pos.submarine.parts = [
            { x: pos.submarine.x + 1, y: pos.submarine.y + 0 },
            { x: pos.submarine.x + 0, y: pos.submarine.y - 1 },
            { x: pos.submarine.x + 0, y: pos.submarine.y + 0 },
            { x: pos.submarine.x + 0, y: pos.submarine.y + 1 },
        ];



        d = rnd(4);
        pos.destroyer = (d == 0 || d == 2) ? { // horizontal
            x: rnd(4) + 1,
            y: rnd(18),
            d: d,
        } : { // vertical
            x: rnd(6),
            y: rnd(16) + 1,
            d: d,
        };

        if (pos.destroyer.d == 0) pos.destroyer.parts = [
            { x: pos.destroyer.x - 1, y: pos.destroyer.y + 0 },
            { x: pos.destroyer.x + 0, y: pos.destroyer.y + 0 },
            { x: pos.destroyer.x + 1, y: pos.destroyer.y + 0 },
        ];

        if (pos.destroyer.d == 1) pos.destroyer.parts = [
            { x: pos.destroyer.x + 0, y: pos.destroyer.y - 1 },
            { x: pos.destroyer.x + 0, y: pos.destroyer.y + 0 },
            { x: pos.destroyer.x + 0, y: pos.destroyer.y + 1 },
        ];

        if (pos.destroyer.d == 2) pos.destroyer.parts = [
            { x: pos.destroyer.x - 1, y: pos.destroyer.y + 0 },
            { x: pos.destroyer.x + 0, y: pos.destroyer.y + 0 },
            { x: pos.destroyer.x + 1, y: pos.destroyer.y + 0 },
        ];

        if (pos.destroyer.d == 3) pos.destroyer.parts = [
            { x: pos.destroyer.x + 0, y: pos.destroyer.y - 1 },
            { x: pos.destroyer.x + 0, y: pos.destroyer.y + 0 },
            { x: pos.destroyer.x + 0, y: pos.destroyer.y + 1 },
        ];



        d = rnd(4);
        pos.battleship = (d == 0 || d == 2) ? { // horizontal
            x: rnd(2) + 2,
            y: rnd(18),
            d: d,
        } : { // vertical
            x: rnd(6),
            y: rnd(14) + 2,
            d: d,
        };

        if (pos.battleship.d == 0) pos.battleship.parts = [
            { x: pos.battleship.x - 2, y: pos.battleship.y + 0 },
            { x: pos.battleship.x - 1, y: pos.battleship.y + 0 },
            { x: pos.battleship.x + 0, y: pos.battleship.y + 0 },
            { x: pos.battleship.x + 1, y: pos.battleship.y + 0 },
            { x: pos.battleship.x + 2, y: pos.battleship.y + 0 },
        ];

        if (pos.battleship.d == 1) pos.battleship.parts = [
            { x: pos.battleship.x + 0, y: pos.battleship.y - 2 },
            { x: pos.battleship.x + 0, y: pos.battleship.y - 1 },
            { x: pos.battleship.x + 0, y: pos.battleship.y + 0 },
            { x: pos.battleship.x + 0, y: pos.battleship.y + 1 },
            { x: pos.battleship.x + 0, y: pos.battleship.y + 2 },
        ];

        if (pos.battleship.d == 2) pos.battleship.parts = [
            { x: pos.battleship.x - 2, y: pos.battleship.y + 0 },
            { x: pos.battleship.x - 1, y: pos.battleship.y + 0 },
            { x: pos.battleship.x + 0, y: pos.battleship.y + 0 },
            { x: pos.battleship.x + 1, y: pos.battleship.y + 0 },
            { x: pos.battleship.x + 2, y: pos.battleship.y + 0 },
        ];

        if (pos.battleship.d == 3) pos.battleship.parts = [
            { x: pos.battleship.x + 0, y: pos.battleship.y - 2 },
            { x: pos.battleship.x + 0, y: pos.battleship.y - 1 },
            { x: pos.battleship.x + 0, y: pos.battleship.y + 0 },
            { x: pos.battleship.x + 0, y: pos.battleship.y + 1 },
            { x: pos.battleship.x + 0, y: pos.battleship.y + 2 },
        ];




        needPlacement = false;

        for (let ipos1 in pos) for (let ipart1 of pos[ipos1].parts)
            for (let ipos2 in pos) for (let ipart2 of pos[ipos2].parts)
                if (ipos1 != ipos2)
                    if ((Math.abs(ipart1.x - ipart2.x) + Math.abs(ipart1.y - ipart2.y)) < 2)
                        needPlacement = true;
    }

    return pos;
}
