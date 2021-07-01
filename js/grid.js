


// ask player to validate ships locations

function placeFleet() {

    let confirmed = false;

    while (!confirmed) {

        for (let boat of boatSprites[true]) app.stage.removeChild(boat);

        displayBoats(placeShips());
        buildGrid(true);

        app.ticker.update();

        //confirmed = window.confirm("Confirm fleet");
        confirmed = true;
    }
}



// controlled random layout

function placeShips() {

    let needPlacement = true;
    my.fleetPos = {};
    let grid;

    while (needPlacement) {

        grid = new Array(18).fill(new Array(6).fill(false));



        let d = rnd(4);
        my.fleetPos.carrier = (d == 0 || d == 2) ? { // horizontal
            x: rnd(3) + 1,
            y: rnd(17) + 0,
            d: d,
            hp: 6
        } : { // vertical
            x: rnd(5) + 0,
            y: rnd(15) + 1,
            d: d,
            hp: 6
        };

        if (my.fleetPos.carrier.d == 0) my.fleetPos.carrier.parts = [
            { x: my.fleetPos.carrier.x - 1, y: my.fleetPos.carrier.y + 0 },
            { x: my.fleetPos.carrier.x + 0, y: my.fleetPos.carrier.y + 0 },
            { x: my.fleetPos.carrier.x + 1, y: my.fleetPos.carrier.y + 0 },
            { x: my.fleetPos.carrier.x + 0, y: my.fleetPos.carrier.y + 1 },
            { x: my.fleetPos.carrier.x + 1, y: my.fleetPos.carrier.y + 1 },
            { x: my.fleetPos.carrier.x + 2, y: my.fleetPos.carrier.y + 1 },
        ];

        if (my.fleetPos.carrier.d == 1) my.fleetPos.carrier.parts = [
            { x: my.fleetPos.carrier.x + 0, y: my.fleetPos.carrier.y + 0 },
            { x: my.fleetPos.carrier.x + 0, y: my.fleetPos.carrier.y + 1 },
            { x: my.fleetPos.carrier.x + 0, y: my.fleetPos.carrier.y + 2 },
            { x: my.fleetPos.carrier.x + 1, y: my.fleetPos.carrier.y - 1 },
            { x: my.fleetPos.carrier.x + 1, y: my.fleetPos.carrier.y + 0 },
            { x: my.fleetPos.carrier.x + 1, y: my.fleetPos.carrier.y + 1 },
        ];

        if (my.fleetPos.carrier.d == 2) my.fleetPos.carrier.parts = [
            { x: my.fleetPos.carrier.x - 1, y: my.fleetPos.carrier.y + 1 },
            { x: my.fleetPos.carrier.x + 0, y: my.fleetPos.carrier.y + 1 },
            { x: my.fleetPos.carrier.x + 1, y: my.fleetPos.carrier.y + 1 },
            { x: my.fleetPos.carrier.x + 0, y: my.fleetPos.carrier.y + 0 },
            { x: my.fleetPos.carrier.x + 1, y: my.fleetPos.carrier.y + 0 },
            { x: my.fleetPos.carrier.x + 2, y: my.fleetPos.carrier.y + 0 },
        ];

        if (my.fleetPos.carrier.d == 3) my.fleetPos.carrier.parts = [
            { x: my.fleetPos.carrier.x + 1, y: my.fleetPos.carrier.y + 0 },
            { x: my.fleetPos.carrier.x + 1, y: my.fleetPos.carrier.y + 1 },
            { x: my.fleetPos.carrier.x + 1, y: my.fleetPos.carrier.y + 2 },
            { x: my.fleetPos.carrier.x + 0, y: my.fleetPos.carrier.y - 1 },
            { x: my.fleetPos.carrier.x + 0, y: my.fleetPos.carrier.y + 0 },
            { x: my.fleetPos.carrier.x + 0, y: my.fleetPos.carrier.y + 1 },
        ];



        d = rnd(4);
        my.fleetPos.submarine = (d == 0 || d == 2) ? { // horizontal
            x: rnd(4) + 1,
            y: rnd(17) + (d == 0 ? 0 : 1),
            d: d,
            hp: 4
        } : { // vertical
            x: rnd(5) + (d == 1 ? 1 : 0),
            y: rnd(16) + 1,
            d: d,
            hp: 4
        };

        if (my.fleetPos.submarine.d == 0) my.fleetPos.submarine.parts = [
            { x: my.fleetPos.submarine.x - 1, y: my.fleetPos.submarine.y + 0 },
            { x: my.fleetPos.submarine.x + 0, y: my.fleetPos.submarine.y + 0 },
            { x: my.fleetPos.submarine.x + 1, y: my.fleetPos.submarine.y + 0 },
            { x: my.fleetPos.submarine.x + 0, y: my.fleetPos.submarine.y + 1 },
        ];

        if (my.fleetPos.submarine.d == 1) my.fleetPos.submarine.parts = [
            { x: my.fleetPos.submarine.x - 1, y: my.fleetPos.submarine.y + 0 },
            { x: my.fleetPos.submarine.x + 0, y: my.fleetPos.submarine.y - 1 },
            { x: my.fleetPos.submarine.x + 0, y: my.fleetPos.submarine.y + 0 },
            { x: my.fleetPos.submarine.x + 0, y: my.fleetPos.submarine.y + 1 },
        ];

        if (my.fleetPos.submarine.d == 2) my.fleetPos.submarine.parts = [
            { x: my.fleetPos.submarine.x - 1, y: my.fleetPos.submarine.y + 0 },
            { x: my.fleetPos.submarine.x + 0, y: my.fleetPos.submarine.y + 0 },
            { x: my.fleetPos.submarine.x + 1, y: my.fleetPos.submarine.y + 0 },
            { x: my.fleetPos.submarine.x + 0, y: my.fleetPos.submarine.y - 1 },
        ];

        if (my.fleetPos.submarine.d == 3) my.fleetPos.submarine.parts = [
            { x: my.fleetPos.submarine.x + 1, y: my.fleetPos.submarine.y + 0 },
            { x: my.fleetPos.submarine.x + 0, y: my.fleetPos.submarine.y - 1 },
            { x: my.fleetPos.submarine.x + 0, y: my.fleetPos.submarine.y + 0 },
            { x: my.fleetPos.submarine.x + 0, y: my.fleetPos.submarine.y + 1 },
        ];



        d = rnd(4);
        my.fleetPos.destroyer = (d == 0 || d == 2) ? { // horizontal
            x: rnd(4) + 1,
            y: rnd(18),
            d: d,
            hp: 3
        } : { // vertical
            x: rnd(6),
            y: rnd(16) + 1,
            d: d,
            hp: 3
        };

        if (my.fleetPos.destroyer.d == 0) my.fleetPos.destroyer.parts = [
            { x: my.fleetPos.destroyer.x - 1, y: my.fleetPos.destroyer.y + 0 },
            { x: my.fleetPos.destroyer.x + 0, y: my.fleetPos.destroyer.y + 0 },
            { x: my.fleetPos.destroyer.x + 1, y: my.fleetPos.destroyer.y + 0 },
        ];

        if (my.fleetPos.destroyer.d == 1) my.fleetPos.destroyer.parts = [
            { x: my.fleetPos.destroyer.x + 0, y: my.fleetPos.destroyer.y - 1 },
            { x: my.fleetPos.destroyer.x + 0, y: my.fleetPos.destroyer.y + 0 },
            { x: my.fleetPos.destroyer.x + 0, y: my.fleetPos.destroyer.y + 1 },
        ];

        if (my.fleetPos.destroyer.d == 2) my.fleetPos.destroyer.parts = [
            { x: my.fleetPos.destroyer.x - 1, y: my.fleetPos.destroyer.y + 0 },
            { x: my.fleetPos.destroyer.x + 0, y: my.fleetPos.destroyer.y + 0 },
            { x: my.fleetPos.destroyer.x + 1, y: my.fleetPos.destroyer.y + 0 },
        ];

        if (my.fleetPos.destroyer.d == 3) my.fleetPos.destroyer.parts = [
            { x: my.fleetPos.destroyer.x + 0, y: my.fleetPos.destroyer.y - 1 },
            { x: my.fleetPos.destroyer.x + 0, y: my.fleetPos.destroyer.y + 0 },
            { x: my.fleetPos.destroyer.x + 0, y: my.fleetPos.destroyer.y + 1 },
        ];



        d = rnd(4);
        my.fleetPos.battleship = (d == 0 || d == 2) ? { // horizontal
            x: rnd(2) + 2,
            y: rnd(18),
            d: d,
            hp: 5
        } : { // vertical
            x: rnd(6),
            y: rnd(14) + 2,
            d: d,
            hp: 5
        };

        if (my.fleetPos.battleship.d == 0) my.fleetPos.battleship.parts = [
            { x: my.fleetPos.battleship.x - 2, y: my.fleetPos.battleship.y + 0 },
            { x: my.fleetPos.battleship.x - 1, y: my.fleetPos.battleship.y + 0 },
            { x: my.fleetPos.battleship.x + 0, y: my.fleetPos.battleship.y + 0 },
            { x: my.fleetPos.battleship.x + 1, y: my.fleetPos.battleship.y + 0 },
            { x: my.fleetPos.battleship.x + 2, y: my.fleetPos.battleship.y + 0 },
        ];

        if (my.fleetPos.battleship.d == 1) my.fleetPos.battleship.parts = [
            { x: my.fleetPos.battleship.x + 0, y: my.fleetPos.battleship.y - 2 },
            { x: my.fleetPos.battleship.x + 0, y: my.fleetPos.battleship.y - 1 },
            { x: my.fleetPos.battleship.x + 0, y: my.fleetPos.battleship.y + 0 },
            { x: my.fleetPos.battleship.x + 0, y: my.fleetPos.battleship.y + 1 },
            { x: my.fleetPos.battleship.x + 0, y: my.fleetPos.battleship.y + 2 },
        ];

        if (my.fleetPos.battleship.d == 2) my.fleetPos.battleship.parts = [
            { x: my.fleetPos.battleship.x - 2, y: my.fleetPos.battleship.y + 0 },
            { x: my.fleetPos.battleship.x - 1, y: my.fleetPos.battleship.y + 0 },
            { x: my.fleetPos.battleship.x + 0, y: my.fleetPos.battleship.y + 0 },
            { x: my.fleetPos.battleship.x + 1, y: my.fleetPos.battleship.y + 0 },
            { x: my.fleetPos.battleship.x + 2, y: my.fleetPos.battleship.y + 0 },
        ];

        if (my.fleetPos.battleship.d == 3) my.fleetPos.battleship.parts = [
            { x: my.fleetPos.battleship.x + 0, y: my.fleetPos.battleship.y - 2 },
            { x: my.fleetPos.battleship.x + 0, y: my.fleetPos.battleship.y - 1 },
            { x: my.fleetPos.battleship.x + 0, y: my.fleetPos.battleship.y + 0 },
            { x: my.fleetPos.battleship.x + 0, y: my.fleetPos.battleship.y + 1 },
            { x: my.fleetPos.battleship.x + 0, y: my.fleetPos.battleship.y + 2 },
        ];




        needPlacement = false;

        for (let ipos1 in my.fleetPos) for (let ipart1 of my.fleetPos[ipos1].parts)
            for (let ipos2 in my.fleetPos) for (let ipart2 of my.fleetPos[ipos2].parts)
                if (ipos1 != ipos2)
                    if ((Math.abs(ipart1.x - ipart2.x) + Math.abs(ipart1.y - ipart2.y)) < 2)
                        needPlacement = true;
    }

    return my.fleetPos;
}
