var game = new Phaser.Game(660, 660, Phaser.AUTO, "gamePart");

//------------------------------
// Global variables
//------------------------------
var idle = true; //true if the player has already pressed a key
var debug = false; //if set at true, it display the debug display

var map; //store the map
var scrollSpeed = 2;
var playerCameraRatio;

// layers
var layerBackground;
var layerWalls;

//Keys
var fireKey; // z
var focusKey; // x
var bombKey; // c
var cursor; // up/down/left/right

//mobile object blocs
var enemies;
var playerObj;

var playerNormalSpeed = 250;
var playerFocusSpeed = 75;

//bullets groups
var playerBullets;
var enemiesBullets;

var nextBullet;
var gameFireRate;

var maxPBullets = 1000;
var maxEBullets = 1000;

var fireRate = 100;
var fireRateOld = null;
var fireRateOldE = null;
var circle = 0;

var score = 0;
var bombNbr = 3;
var bombCooldown = 1000;
var bombCooldownVar;

var text;

//------------------------------
// Adding all game states
//------------------------------
game.state.add("preloadState", preloadState);
game.state.add("menuState", menuState);
game.state.add("gameState", gameState);
game.state.add("winState", winState);
game.state.add("loseState", loseState);
game.state.add("creditState", creditState);

console.log('All states loaded');

game.state.start("preloadState");

function resetVar()
{
  idle = true;
  debug = false;
  map = null;
  scrollSpeed = 2;
  playerCameraRatio = null;
  layerBackground = null;
  layerWalls = null;
  fireKey = null;
  focusKey = null;
  bombKey = null;
  cursor = null;
  enemies = null;
  playerObj = null;
  playerNormalSpeed = 250;
  playerFocusSpeed = 75;
  playerBullets = null;
  enemiesBullets = null;
  nextBullet = null;
  gameFireRate = null;
  maxPBullets = 1000;
  maxEBullets = 1000;
  fireRate = 100;
  fireRateOld = null;
  fireRateOldE = null;
  circle = 0;
  score = 0;
  bombNbr = 3;
  bombCooldown = 1000;
  bombCooldownVar = null;
  text = null;
}
