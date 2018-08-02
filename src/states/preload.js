var preloadState = function(){};

preloadState.prototype = {
  preload: function(){

    game.load.tilemap('map', 'assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('sprites', 'assets/sprites.png');
    game.load.image('playerSprite', 'assets/player.png');
    game.load.image('enemySprite', 'assets/enemy.png');
    game.load.image('playerBullet', 'assets/playerBullet.png', 8, 8);
    game.load.image('enemyBullet', 'assets/enemyBullet.png', 8, 8);
    game.load.image('howToPlay', 'assets/howToPlay.png');
    game.load.image('credits', 'assets/credits.png');
  },
  create: function(){
    game.state.start("menuState"); //redirect to the game
  },
  update: function(){}
};
