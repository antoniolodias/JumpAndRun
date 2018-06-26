(function() {

    const menuScene = {
        key: "menu",
        active: true,
        init: function(config) {
            console.log("Menu init", config);
        },
        preload: function() {
            console.log("Menu preload");
        },
        create: (config)=>{
            console.log("Menu create", config);
        },
        update: function() {
            // console.log("Menu update");
        }
    };

    const level01Scene = {
        key: 'level01',
        active: true,
        renderToTexture: true, //?
        x: 64,
        y: 64,
        width: 1200,
        height: 495,

        init: function(config) {

            var sprite;
            var floor;
            var platforms;
            var square;
            var cloud;
            var apple;
            var tilePhysics = {};
            var playerBig = false;
            // this.playerWithDoor = false;
            var playerWithDoor = false;
            var openDoor = false;
            var bigJumpedOnce = false;

            this.platformsCoords = [
                { x: 0, y: 420 },
                { x: 50, y: 420 },
                { x: 100, y: 420 },
                { x: 150, y: 420 },
                { x: 200, y: 420 },
                { x: 250, y: 420 },
                { x: 300, y: 420 },
                { x: 350, y: 420 },
                { x: 300, y: 320 }
            ];




        },

        preload: function() {
            console.log('[Level01] preload');
            // load the assets we need
            // the first parameter, also known as the asset key
            this.load.image("sky", "assets/whiteback.png");
            this.load.image("floor", "assets/floortest.png");
            this.load.image("green10", "assets/green10.png");
            this.load.image("green50", "assets/green50.png");
            this.load.image("coin", "assets/coin.png");
            this.load.image("apple", "assets/apple.png");
            this.load.image("mushroom", "assets/mushroom.png");
            this.load.image("bomb", "assets/tutorial01things/bomb.png");
            this.load.image("door", "assets/door.png");
            this.load.image("doorOpen", "assets/doorOpen.png");

            this.load.spritesheet("playerBig", "assets/playerBig.png", {
                frameWidth: 32,
                frameHeight: 90
            });

            this.load.spritesheet("player", "assets/player.png", {
                frameWidth: 32,
                frameHeight: 48
            });
        },

        create: function() {

            // console.log('[Level01] create');
            // console.log("this", this);
            // console.log(this.scene);
            // console.log(this.scene.scene.default);
           this.add.image(0, 0, "sky").setOrigin(0, 0);

           platforms = this.physics.add.staticGroup();
           platforms.enableBody = true;
           this.platformsCoords.forEach(function(coord) {
               platforms.create(coord.x, coord.y, "green50");
           });

           floor = this.physics.add.staticGroup();
           floor.create(600, 500, "floor");

           doors = this.physics.add.sprite(1100, 460, "door");
           // doors.create(1100, 460, "door");
           doors.setCollideWorldBounds(true); // colision with window

           sprite = this.physics.add.sprite(250, 200, "player");

           // sprite.setBounce(0.2);
           sprite.setCollideWorldBounds(true); // colision with window

           this.anims.create({
               key: "left",
               frames: this.anims.generateFrameNumbers("player", {
                   start: 0,
                   end: 3
               }), // frames 0, 1, 2 and 3
               frameRate: 10, // animation runs at 10 frames/second
               repeat: -1 //tells animation to repeat
           });

           this.anims.create({
               key: "turn",
               frames: [{ key: "player", frame: 4 }],
               frameRate: 20
           });

           this.anims.create({
               key: "right",
               frames: this.anims.generateFrameNumbers("player", {
                   start: 5,
                   end: 8
               }),
               frameRate: 10,
               repeat: -1
           });

           this.anims.create({
               key: "leftBig",
               frames: this.anims.generateFrameNumbers("playerBig", {
                   start: 0,
                   end: 3
               }), // frames 0, 1, 2 and 3
               frameRate: 10, // animation runs at 10 frames/second
               repeat: -1 //tells animation to repeat
           });

           this.anims.create({
               key: "turnBig",
               frames: [{ key: "playerBig", frame: 4 }],
               frameRate: 20
           });

           this.anims.create({
               key: "rightBig",
               frames: this.anims.generateFrameNumbers("playerBig", {
                   start: 5,
                   end: 8
               }),
               frameRate: 10,
               repeat: -1
           });

           cursors = this.input.keyboard.createCursorKeys(); //built-in Keyboard manager

           apples = this.physics.add.group();
           apples.create(450, 475, "apple");

           mushrooms = this.physics.add.group();
           mushrooms.create(600, 475, "mushroom");

           coins = this.physics.add.group({
               key: "coin",
               repeat: 2,
               setXY: { x: 12, y: 20, stepX: 145 }
           });

           coins.children.iterate(function(child) {
               child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); //random Y bounce value between 0.4 and 0.8.
           });

           this.physics.add.collider(sprite, platforms);
           this.physics.add.collider(sprite, floor);

           this.physics.add.collider(coins, platforms);
           this.physics.add.collider(coins, floor);

           this.physics.add.collider(apples, platforms);
           this.physics.add.collider(apples, floor);

           this.physics.add.collider(mushrooms, platforms);
           this.physics.add.collider(mushrooms, floor);

           this.physics.add.overlap(sprite, coins, collectcoin, null, this);
           this.physics.add.overlap(sprite, apples, collectapple, null, this);
           this.physics.add.overlap(
               sprite,
               mushrooms,
               collectmushroom,
               null,
               this
           );
           this.physics.add.overlap(sprite, doors, enterDoor, null, this);

           function collectcoin(sprite, coin) {
               console.log("coin");
               coin.disableBody(true, true);

               if (coins.countActive(true) === 0) {
                   doors.setTexture("doorOpen", 0, false);
                   this.openDoor = true;
               }
           };
           function collectapple(sprite, apple) {
               sprite.setVelocityY(-100);
               apple.disableBody(true, true);
               this.playerBig = true;
               sprite.setTexture("playerBig", 0, false);
           };
           function collectmushroom(sprite, mushroom) {
               mushroom.disableBody(true, true);
               sprite.setTexture("player", 0, false);
               this.playerBig = false;
           };
           function enterDoor(sprite, door) {
               // console.log("Door");
               if (this.openDoor) {
                   this.playerWithDoor = true;
               }
           };
        },





        update: function() {
            // console.log('[BOOT] update');
            // console.log("THIS", this.playerWithDoor);
            if (this.playerWithDoor && cursors.up.isDown) {
                console.log("yo");
                game.scene.stop("level01");
                game.scene.start("level02");
                // game.scene.start("level02",{ someData: "... somedata I would like to pass"})
            } else {
                if (!this.playerBig) {
                    sprite.body.setSize(32, 48);
                    if (cursors.left.isDown) {
                        sprite.setVelocityX(-160);
                        sprite.anims.play("left", true);
                    } else if (cursors.right.isDown) {
                        sprite.setVelocityX(160);
                        sprite.anims.play("right", true);
                    } else {
                        sprite.setVelocityX(0);
                        sprite.anims.play("turn");
                    }
                    if (cursors.up.isDown && sprite.body.touching.down) {
                        sprite.setVelocityY(-200); //200 px/sec sq.
                    }
                } else {
                    sprite.body.setSize(32, 53);
                    if (cursors.left.isDown) {
                        sprite.setVelocityX(-160);
                        sprite.anims.play("leftBig", true);
                    } else if (cursors.right.isDown) {
                        sprite.setVelocityX(160);
                        sprite.anims.play("rightBig", true);
                    } else {
                        sprite.setVelocityX(0);
                        sprite.anims.play("turnBig");
                    }
                    if (!this.bigJumpedOnce) {
                        if (cursors.up.isDown) {
                            // console.log("firstBigdown");
                            sprite.setVelocityY(-300);
                            this.bigJumpedOnce = true;
                        }
                    } else {
                        if (cursors.up.isDown && sprite.body.touching.down) {
                            // console.log("Moredown");
                            sprite.setVelocityY(-300);
                        }
                    }
                }
            }
        }
};
    const level02Scene = {
        key: 'level02',
        active: false,
        renderToTexture: true, //?
        x: 64,
        y: 64,
        width: 1200,
        height: 495,

        init: function(config) {

            var sprite;
            var floor;
            var platforms;
            var square;
            var cloud;
            var apple;
            var tilePhysics = {};
            var playerBig = false;
            // this.playerWithDoor = false;
            var playerWithDoor = false;
            var openDoor = false;
            var bigJumpedOnce = false;

            this.platformsCoords = [
                { x: 0, y: 420 },
                { x: 50, y: 420 },
                { x: 100, y: 420 },
                { x: 150, y: 420 },
                { x: 200, y: 420 },
                { x: 250, y: 420 },
                { x: 300, y: 420 },
                { x: 350, y: 420 },
                { x: 300, y: 320 }
            ];
        },

        preload: function() {
            console.log('[Level01] preload');
            // load the assets we need
            // the first parameter, also known as the asset key
            this.load.image("sky", "assets/whiteback-2.png");
            this.load.image("floor", "assets/floortest.png");
            this.load.image("green10", "assets/green10.png");
            this.load.image("green50", "assets/green50.png");
            this.load.image("coin", "assets/coin.png");
            this.load.image("apple", "assets/apple.png");
            this.load.image("mushroom", "assets/mushroom.png");
            this.load.image("bomb", "assets/tutorial01things/bomb.png");
            this.load.image("door", "assets/door.png");
            this.load.image("doorOpen", "assets/doorOpen.png");

            this.load.spritesheet("playerBig", "assets/playerBig.png", {
                frameWidth: 32,
                frameHeight: 90
            });

            this.load.spritesheet("player", "assets/player.png", {
                frameWidth: 32,
                frameHeight: 48
            });
        },

        create: function() {
            console.log("LEVEL 02");

            // console.log('[Level01] create');
            // console.log("this", this);
            // console.log(this.scene);
            // console.log(this.scene.scene.default);
           this.add.image(0, 0, "sky").setOrigin(0, 0);

           platforms = this.physics.add.staticGroup();
           platforms.enableBody = true;
           this.platformsCoords.forEach(function(coord) {
               platforms.create(coord.x, coord.y, "green50");
           });

           floor = this.physics.add.staticGroup();
           floor.create(600, 500, "floor");

           doors = this.physics.add.sprite(1100, 460, "door");
           // doors.create(1100, 460, "door");
           doors.setCollideWorldBounds(true); // colision with window

           sprite = this.physics.add.sprite(250, 200, "player");

           // sprite.setBounce(0.2);
           sprite.setCollideWorldBounds(true); // colision with window

           this.anims.create({
               key: "left",
               frames: this.anims.generateFrameNumbers("player", {
                   start: 0,
                   end: 3
               }), // frames 0, 1, 2 and 3
               frameRate: 10, // animation runs at 10 frames/second
               repeat: -1 //tells animation to repeat
           });

           this.anims.create({
               key: "turn",
               frames: [{ key: "player", frame: 4 }],
               frameRate: 20
           });

           this.anims.create({
               key: "right",
               frames: this.anims.generateFrameNumbers("player", {
                   start: 5,
                   end: 8
               }),
               frameRate: 10,
               repeat: -1
           });

           this.anims.create({
               key: "leftBig",
               frames: this.anims.generateFrameNumbers("playerBig", {
                   start: 0,
                   end: 3
               }), // frames 0, 1, 2 and 3
               frameRate: 10, // animation runs at 10 frames/second
               repeat: -1 //tells animation to repeat
           });

           this.anims.create({
               key: "turnBig",
               frames: [{ key: "playerBig", frame: 4 }],
               frameRate: 20
           });

           this.anims.create({
               key: "rightBig",
               frames: this.anims.generateFrameNumbers("playerBig", {
                   start: 5,
                   end: 8
               }),
               frameRate: 10,
               repeat: -1
           });

           cursors = this.input.keyboard.createCursorKeys(); //built-in Keyboard manager

           apples = this.physics.add.group();
           apples.create(450, 475, "apple");

           mushrooms = this.physics.add.group();
           mushrooms.create(600, 475, "mushroom");

           coins = this.physics.add.group({
               key: "coin",
               repeat: 2,
               setXY: { x: 12, y: 20, stepX: 145 }
           });

           coins.children.iterate(function(child) {
               child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); //random Y bounce value between 0.4 and 0.8.
           });

           this.physics.add.collider(sprite, platforms);
           this.physics.add.collider(sprite, floor);

           this.physics.add.collider(coins, platforms);
           this.physics.add.collider(coins, floor);

           this.physics.add.collider(apples, platforms);
           this.physics.add.collider(apples, floor);

           this.physics.add.collider(mushrooms, platforms);
           this.physics.add.collider(mushrooms, floor);

           this.physics.add.overlap(sprite, coins, collectcoin, null, this);
           this.physics.add.overlap(sprite, apples, collectapple, null, this);
           this.physics.add.overlap(
               sprite,
               mushrooms,
               collectmushroom,
               null,
               this
           );
           this.physics.add.overlap(sprite, doors, enterDoor, null, this);

           function collectcoin(sprite, coin) {
               console.log("coin");
               coin.disableBody(true, true);

               if (coins.countActive(true) === 0) {
                   doors.setTexture("doorOpen", 0, false);
                   this.openDoor = true;
               }
           };
           function collectapple(sprite, apple) {
               sprite.setVelocityY(-100);
               apple.disableBody(true, true);
               this.playerBig = true;
               sprite.setTexture("playerBig", 0, false);
           };
           function collectmushroom(sprite, mushroom) {
               mushroom.disableBody(true, true);
               sprite.setTexture("player", 0, false);
               this.playerBig = false;
           };
           function enterDoor(sprite, door) {
               // console.log("Door");
               if (this.openDoor) {
                   this.playerWithDoor = true;
               }
           };
        },





        update: function() {
            // console.log('[BOOT] update');
            // console.log("THIS", this.playerWithDoor);
            if (this.playerWithDoor && cursors.up.isDown) {
                console.log("yo");
                game.scene.start("level02");
                // game.scene.start("level02",{ someData: "... somedata I would like to pass"})
            } else {
                if (!this.playerBig) {
                    sprite.body.setSize(32, 48);
                    if (cursors.left.isDown) {
                        sprite.setVelocityX(-160);
                        sprite.anims.play("left", true);
                    } else if (cursors.right.isDown) {
                        sprite.setVelocityX(160);
                        sprite.anims.play("right", true);
                    } else {
                        sprite.setVelocityX(0);
                        sprite.anims.play("turn");
                    }
                    if (cursors.up.isDown && sprite.body.touching.down) {
                        sprite.setVelocityY(-200); //200 px/sec sq.
                    }
                } else {
                    sprite.body.setSize(32, 53);
                    if (cursors.left.isDown) {
                        sprite.setVelocityX(-160);
                        sprite.anims.play("leftBig", true);
                    } else if (cursors.right.isDown) {
                        sprite.setVelocityX(160);
                        sprite.anims.play("rightBig", true);
                    } else {
                        sprite.setVelocityX(0);
                        sprite.anims.play("turnBig");
                    }
                    if (!this.bigJumpedOnce) {
                        if (cursors.up.isDown) {
                            // console.log("firstBigdown");
                            sprite.setVelocityY(-300);
                            this.bigJumpedOnce = true;
                        }
                    } else {
                        if (cursors.up.isDown && sprite.body.touching.down) {
                            // console.log("Moredown");
                            sprite.setVelocityY(-300);
                        }
                    }
                }
            }
        }
};

    const gameConfig = {
        type: Phaser.CANVAS,
        parent: 'phaser-example',//?
        width: 1200,
        height: 495,
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 400 },
                debug: false
            }
        },
        scene: [ menuScene, level01Scene, level02Scene ]
};


    var game = new Phaser.Game(gameConfig);
    game.scene.start('menu');
})();
