var menuState = function(){};

menuState.prototype = {
  preload: function(){
    fireKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
    focusKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    bombKey = game.input.keyboard.addKey(Phaser.Keyboard.C);
  },
  create: function(){
    game.add.sprite(0, 0, 'howToPlay');
  },
  update: function(){
    if(fireKey.isDown)
      game.state.start("gameState");
    if(bombKey.isDown)
      game.state.start("creditState");
  }
};
