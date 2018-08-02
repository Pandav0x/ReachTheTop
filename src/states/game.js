var gameState = function(){};

gameState.prototype = {
  preload: function(){
    resetVar();
    fireKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
    focusKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    bombKey = game.input.keyboard.addKey(Phaser.Keyboard.C);
    cursor = game.input.keyboard.createCursorKeys();
  },
  create: function(){

    game.physics.startSystem(Phaser.Physics.ARCADE);
    //setting the boudaries for the game
    game.world.setBounds(660, 3300);

    //creating map
    map = game.add.tilemap('map');
    map.addTilesetImage('sprites', 'sprites');

    //displaying map
    layerBackground = map.createLayer('background');
    layerWalls = map.createLayer('walls');
    layerWalls.resizeWorld();
    layerBackground.resizeWorld();

    game.physics.arcade.enable(layerWalls);
    map.setCollision(2, true, layerWalls);

    //creating elements
    enemies = game.add.group();
    enemies.enableBody = true;

    console.log("beam me up scotty  !!!"); //just a debuging text, I can see if I am in the create function

    //retreive data from mob.json (player and enemies)
    jQuery.getJSON("assets/tilemaps/mob.json", function(data)
    {
      console.log("Retreiving data from mob.json");
        playerObj = game.add.sprite(data["player"].x, data["player"].y, 'playerSprite');
        data["ennemies"].forEach(function(enemy)
        {
          enemies.create(enemy.x, enemy.y, 'enemySprite');
        });

      //must put code inside the getJSON function because it's asynchronous
      //--------------------------------------------------------------------

      game.physics.arcade.enable(playerObj);
      playerObj.enableBody = true;
      playerObj.body.collideWorldBounds = true;
      playerObj.body.speed = 5;
      game.physics.arcade.enable(enemies);

      //seting the camera
      game.camera.follow(playerObj, Phaser.Camera.FOLLOW_TOPDOWN);

      //setting the bullets groups
      playerBullets = game.add.group();
      playerBullets.enableBody = true;
      playerBullets.physicsBodyType = Phaser.Physics.ARCADE;
      playerBullets.createMultiple(maxPBullets, 'playerBullet');
      playerBullets.setAll('checkWorldBounds', true);
      playerBullets.setAll('outOfBoundsKill', true);

      enemiesBullets = game.add.group();
      enemiesBullets.enableBody = true;
      enemiesBullets.physicsBodyType = Phaser.Physics.ARCADE;
      enemiesBullets.createMultiple(maxEBullets, 'enemyBullet');
      enemiesBullets.setAll('anchor.x', 0.5);
      enemiesBullets.setAll('anchor.y', 0.5);
      enemiesBullets.setAll('checkWorldBounds', true);
      enemiesBullets.setAll('outOfBoundsKill', true);

    });

    text = game.add.text(game.world._width - 100, game.camera.y, "", {
        font: "20px Arial",
        fill: "#fff",
        align: "center"
    });
    text.fixedToCamera = true;
  },

  update: function(){


    game.physics.arcade.overlap(playerBullets, enemies, collisionHandler, null, this);
    game.physics.arcade.collide(playerObj, enemies, function(player, enemy){player.kill();playerDeath();}, null, this);
    if(!(enemiesBullets == null))
      enemiesBullets.forEach(function(bullet){
        game.physics.arcade.collide(playerObj, bullet, function(player, bullet){player.kill();playerDeath();}, null, this);
      });
    game.physics.arcade.collide(enemiesBullets, layerWalls, function(bullet){bullet.kill();}, null, this);
    game.physics.arcade.collide(playerBullets, layerWalls, function(bullet){bullet.kill();}, null, this);
    game.physics.arcade.collide(playerObj, layerWalls);

    game.time.events.add(Phaser.Timer.SECOND , enemyFire, this); //make enemies shoot

    if(!(idle))
    {
      if(!(playerObj == null)) //as we are in asynchronous task, we need to check if the player has been created or not
      {
        playerObj.body.velocity.x = 0;
        playerObj.body.velocity.y = 0;
        if(playerObj.y <= 0)
          win();
        if (cursor.up.isDown)
        {
          playerObj.body.velocity.y  -= ((!focusKey.isDown)? playerNormalSpeed : playerFocusSpeed);
        }
        else if (cursor.down.isDown)
        {
          playerObj.body.velocity.y += ((!focusKey.isDown)? playerNormalSpeed : playerFocusSpeed);
        }
        if (cursor.left.isDown)
        {
          playerObj.body.velocity.x -= ((!focusKey.isDown)? playerNormalSpeed : playerFocusSpeed);
        }
        else if (cursor.right.isDown)
        {
          playerObj.body.velocity.x += ((!focusKey.isDown)? playerNormalSpeed : playerFocusSpeed);
        }

        if(fireKey.isDown)
          fire();
        if(bombKey.isDown)
          bomb();
      }
    }
    else
      //wait for the player to press a key (my solution seems to be too much tedious)
      if (cursor.up.isDown || cursor.down.isDown || cursor.left.isDown || cursor.right.isDown || fireKey.isDown || focusKey.isDown || bombKey.isDown)
        idle = false;
    updateText();
  },

  render: function()
  {
    if(debug && !(playerObj == null))
    {
      game.debug.text('player x/y: ' + playerObj.x + "/" + playerObj.y, 1, 32);
      game.debug.text('camera x/y: ' + game.camera.x + "/" + game.camera.y, 1, 64);
      game.debug.text('diference y: '+ (playerObj.y - game.camera.y), 1, 96);
      game.debug.text('idle: ' + idle, 1, 128);
      game.debug.text('fire: ' + fireKey.isDown, 1 ,160);
      game.debug.text('focus: ' + focusKey.isDown, 1, 192);
      game.debug.text('bomb: ' + bombKey.isDown + ' still: ' + bombNbr, 1, 224);
      game.debug.text('score: ' + score,1 , 256);
    }
  }
};

function fire()
{
  if((game.time.now - fireRateOld) >= fireRate || fireRateOld == null)
  {
    fireRateOld = game.time.now;
    var bullet = playerBullets.getFirstExists(false);
    var bulletSpeed;
    if(bullet)
    {
      bulletSpeed = (focusKey.isDown)? 2000:1000;
      bullet.reset(playerObj.x + 12.5, playerObj.y + 10);
      bullet.body.velocity.y = -bulletSpeed;
    }
  }
}

function bomb()
{
  if((game.time.now - bombCooldownVar) >= bombCooldown || bombCooldownVar == null)
  {
    bombCooldownVar = game.time.now;
    if(bombNbr > 0)
    {
      enemiesBullets.forEach(function(bullet){
        bullet.kill();
      });
      bombNbr--;
    }
  }
}

function collisionHandler(bullet, target)
{
  bullet.kill();
  target.kill();
  score++;
}

function enemyFire()
{
  var enemyFR = 200;
  if((game.time.now - fireRateOldE) >= fireRate || fireRateOldE == null)
  {
    fireRateOldE = game.time.now;
    enemies.forEachAlive(function(enemy)
    {
      enemyBullet = enemiesBullets.getFirstExists(false);
      if (enemyBullet)
      {
        enemyBullet.reset(enemy.body.x + 15, enemy.body.y + 15);
        switch (circle%4)
        {
          case 0:
            enemyBullet.body.velocity.x += enemyFR;
          break;
          case 1:
            enemyBullet.body.velocity.y += enemyFR;
          break;
          case 2:
            enemyBullet.body.velocity.x -= enemyFR;
          break;
          case 3:
            enemyBullet.body.velocity.y -= enemyFR;
          break;
        }
        circle ++;
      }
    });
  }
}

function playerDeath()
{
  playerObj.kill();
  game.state.start("loseState");
}

function win()
{
  game.state.start("winState");
}

function updateText()
{
  text.setText("Score: " + score  + "\nBombs: " + bombNbr);
}
