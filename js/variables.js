const Vector = Victor;
var collectGarbage;

var playerName = localStorage.getItem("BMC_PlayerName") || '';

var globalScale = 0.2;
var seaScale;
var boatScale;
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

var entities = [];