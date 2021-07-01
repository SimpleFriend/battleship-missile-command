const Vector = Victor;
var collectGarbage;

var playerName = localStorage.getItem("BMC_PlayerName") || '';
var victories = parseInt(localStorage.getItem("BMC_Victories")) || 0;
var defeats = parseInt(localStorage.getItem("BMC_Defeats")) || 0;
var token = localStorage.getItem("BMC_Token") || (Math.random()+Date.now()/1000).toString();
localStorage.getItem("BMC_Token", token);
var success = Math.floor(victories/(victories+defeats)*100) || 0;

var roomName = '';


var gridW = 6;
var gridH = 18;

var fleetPos;

Math.sqr = function (x) { return x * x; }
function rnd(n) { return Math.floor(n * Math.random()); }

var boat;

var boatSprites = {
    true: [],   // blue
    false: []   // red
};

var bgColorMatrix;
var bgBrightness = 1;
var bgWidth = 1920;
var bgName = "synthwave";
var bgBaseBrightness = 0.666;
var bg;


var entities = [];

function posGameToScreen(input) {

    let bx = bg.x, by = bg.y;
    bg.x = app.renderer.view.width / 2;
    bg.y = app.renderer.view.height / 2;
    let pos = { x: input.x * 960 / 100, y: input.y * 960 / 100 };
    let result = bg.toGlobal(pos);
    bg.x = bx; bg.y = by;
    return result;
}

function posScreenToGame(pos) {

    let bx = bg.x, by = bg.y;
    bg.x = app.renderer.view.width / 2;
    bg.y = app.renderer.view.height / 2;
    let output = bg.toLocal(pos);
    output = { x: output.x / 960 * 100, y: output.y / 960 * 100 };
    bg.x = bx; bg.y = by;
    return output;
}

var launcherPos = {
    true: [],
    false: []
}

var my = {};


function simplifyName(name) {

    return name.split('#')[0].trim();
}



function checkNuke(pos) {
    
    let dist = Infinity;
    let target = false;

    for (let x = 0; x < gridW; ++x) for (let y = 0; y < gridH; ++y) {

        let dot = posGameToScreen(seaPos(x, y - 0.5));
        dot.x = app.renderer.view.width - dot.x;

        if (Math.sqr(dot.x - pos.x) + Math.sqr(dot.y - pos.y) < dist) {
            dist = Math.sqr(dot.x - pos.x) + Math.sqr(dot.y - pos.y);
            target = { x: x, y: y };
        }
    }
    return dist < window.dotSqrDiameter * 20 ? target : false;
}


var tmpCrossHairs = {};


var dots = {};


function newVictory() {

    ++victories; localStorage.setItem("BMC_Victories", victories);
    --defeats;   localStorage.setItem("BMC_Defeats", defeats);
}

