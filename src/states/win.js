var winState = function(){};

winState.prototype = {
  preload: function(){
    fireKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
  },
  create: function(){
    game.add.text(game.camera.width/2 -320, game.camera.height/2 -100, "You WIN congratulations !", {
        font: "55px Arial",
        fill: "#fff",
        align: "center"
    });
    game.add.text(game.camera.width/2 -175, game.camera.height/2, "Your score is: " + score, {
        font: "40px Arial",
        fill: "#fff",
        align: "center"
    });

    game.add.text(game.camera.width/2 -175, game.camera.height/2 +100, "Press X to return to main menu", {
        font: "20px Arial",
        fill: "#fff",
        align: "center"
    });
  },
  update: function(){
    if(fireKey.isDown)
      game.state.start('menuState');
  }
};
