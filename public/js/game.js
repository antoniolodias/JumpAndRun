(function() {

    const menuScene = {
        key: "menu",
        active: true,
        renderToTexture: true, //?
        x: 64,
        y: 64,
        width: 1200,
        height: 495,

        preload: function() {
            this.load.spritesheet("buttonStart", "assets/buttonStart.png", {
                frameWidth: 140,
                frameHeight: 50
            });

            this.load.spritesheet("playerBig", "assets/playerBig.png", {
                frameWidth: 32,
                frameHeight: 90
            });

            this.load.spritesheet("player", "assets/player.png", {
                frameWidth: 32,
                frameHeight: 48
            });
        },

        create: function(config){
            this.add.text(300,300,"YOOOOOOOOO00000000000OOOOO");
            player = this.physics.add.sprite(250, 200, "player");
            playerBig = this.physics.add.sprite(300, 200, "playerBig");

            var buttons = this.physics.add.sprite(500,200,"buttonStart").setInteractive();
            buttons.setCollideWorldBounds(true);
            buttons.setBounce(0.4);
            buttons.on('pointerdown', function () {
                game.scene.stop("menu");
                game.scene.start("level01");
            });
            buttons.body.allowGravity = false;
        },
    };

    const level01Scene = {
        key: 'level01',
        active: false,
        renderToTexture: true, //?
        x: 64,
        y: 64,
        width: 1200,
        height: 495,

        init: function(config) {
            var playerBig = false;
            var playerWithDoor = false;
            var openDoor = false;
            var bigJumpedOnce = false;
            var playBackground = true;


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
            this.load.audio('backgroundSound01', 'assets/audio/backgoundSound01.mp3');
            this.load.audio('coinSound', 'assets/audio/coinSound.mp3');
            this.load.audio('appleSound', 'assets/audio/appleSound.mp3');
            this.load.audio('doorSound', 'assets/audio/doorSound.mp3');
            // this.load.audio('stepSound', 'assets/audio/stepSound.mp3');

            this.load.image("sky01", "assets/background01.png");
            this.load.image("floor", "assets/floortest.png");
            this.load.image("green50", "assets/green50.png");
            this.load.image("coin", "assets/coin.png");
            this.load.image("apple", "assets/apple.png");
            this.load.image("mushroom", "assets/mushroom.png");
            // this.load.image("bomb", "assets/tutorial01things/bomb.png");
            this.load.image("door", "assets/door.png");
            this.load.image("doorOpen", "assets/doorOpen.png");

            this.load.spritesheet("restart", "assets/restart.png", {
                frameWidth: 50,
                frameHeight: 50
            });
        },

        create: function() {
            // console.log("load method: ", this.load.image);

           this.add.image(0, 0, "sky01").setOrigin(0, 0);

            var backgroundSound01 = this.sound.add('backgroundSound01', { loop: true });
            backgroundSound01.play();



            var coinSound = this.sound.add('coinSound');
            var appleSound = this.sound.add('appleSound');
            var doorSound = this.sound.add('doorSound');
            // var stepSound = this.sound.add('stepSound');

            // backgroundSound01.stop();
            // backgroundSound01.pause();
            // backgroundSound01.resume();
            // game.sound.setDecodedCallback([ backgroundSound01 ], start, this);

            var self = this;
            var restart = this.physics.add.sprite(50,50,"restart").setInteractive();
            restart.on('pointerdown', function () {
                self.playerBig = false;
                self.playerWithDoor = false;
                self.openDoor = false;
                self.bigJumpedOnce = false;
                backgroundSound01.stop();
                game.scene.stop("level01");
                game.scene.start("level01");
            });

            restart.body.allowGravity = false;

           platforms = this.physics.add.staticGroup();
           platforms.enableBody = true;
           this.platformsCoords.forEach(function(coord) {
               platforms.create(coord.x, coord.y, "green50");
           });

           floor = this.physics.add.staticGroup();
           floor.create(600, 500, "floor");

           doors = this.physics.add.sprite(1100, 460, "door");
           doors.setCollideWorldBounds(true); // colision with window

           sprite = this.physics.add.sprite(250, 200, "player");

           // sprite.setBounce(0.2);
           sprite.setCollideWorldBounds(true); // colision with window

           this.anims.create({

               key: "left",
               frames: this.anims.generateFrameNumbers("player", {
                   start: 0,
                   end: 3
               }),
               frameRate: 10,
               repeat: -1
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
               }),
               frameRate: 10,
               repeat: -1
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

           cursors = this.input.keyboard.createCursorKeys();

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
               child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
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
               coinSound.play();
               // backgroundSound01.stop();
               coin.disableBody(true, true);

               if (coins.countActive(true) === 0) {
                   doors.setTexture("doorOpen", 0, false);
                   this.openDoor = true;
                   doorSound.play()
               }
           };
           function collectapple(sprite, apple) {
               appleSound.play();
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
               if (this.openDoor) {
                   this.playerWithDoor = true;
               }
           };
        },

        update: function() {
            if (this.playerWithDoor && cursors.up.isDown) {
                // console.log("THIS", this.sound.sounds[0].isPlaying);
                this.sound.sounds[0].stop()
                game.scene.stop("level01");
                game.scene.start("level02");
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
                        sprite.setVelocityY(-200);
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
                            sprite.setVelocityY(-300);
                            this.bigJumpedOnce = true;
                        }
                    } else {
                        if (cursors.up.isDown && sprite.body.touching.down) {
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
            var playerBig = false;
            var playerWithDoor = false;
            var openDoor = false;
            var bigJumpedOnce = false;

            this.platformsCoords = [
                { x: 0, y: 420 },
                { x: 250, y: 420 },
                { x: 300, y: 420 },
                { x: 350, y: 420 },
                { x: 500, y: 420 },
                { x: 550, y: 420 }
            ];
        },

        preload: function() {
            console.log('[Level01] preload');
            this.load.image("sky02", "assets/background02.png");
        },

        create: function() {

            console.log("LEVEL 02");
           this.add.image(0, 0, "sky02").setOrigin(0, 0);

           var self = this;
           var restart = this.physics.add.sprite(50,50,"restart").setInteractive();
           restart.on('pointerdown', function () {
               self.playerBig = false;
               self.playerWithDoor = false;
               self.openDoor = false;
               self.bigJumpedOnce = false;
               // backgroundSound02.stop();
               game.scene.stop("level02");
               game.scene.start("level02");
           });

           restart.body.allowGravity = false;

           platforms = this.physics.add.staticGroup();
           platforms.enableBody = true;
           this.platformsCoords.forEach(function(coord) {
               platforms.create(coord.x, coord.y, "green50");
           });

           floor = this.physics.add.staticGroup();
           floor.create(600, 500, "floor");

           doors = this.physics.add.sprite(600, 460, "door");

           doors.setCollideWorldBounds(true);

           sprite = this.physics.add.sprite(250, 200, "player");

           sprite.setCollideWorldBounds(true);



           cursors = this.input.keyboard.createCursorKeys();

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
               if (this.openDoor) {
                   this.playerWithDoor = true;
               }
           };
        },

        update: function() {
            if (this.playerWithDoor && cursors.up.isDown) {
                console.log("yo");
                game.scene.stop("level02");
                game.scene.start("level03");
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
                        sprite.setVelocityY(-200);
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
                            sprite.setVelocityY(-300);
                            this.bigJumpedOnce = true;
                        }
                    } else {
                        if (cursors.up.isDown && sprite.body.touching.down) {
                            sprite.setVelocityY(-300);
                        }
                    }
                }
            }
        }
};

const level03Scene = {
    key: 'level03',
    active: false,
    renderToTexture: true, //?
    x: 64,
    y: 64,
    width: 1200,
    height: 495,

    init: function(config) {
        var playerBig = false;
        var playerWithDoor = false;
        var openDoor = false;
        var bigJumpedOnce = false;

        this.platformsCoords = [
            { x: 0, y: 420 },
            { x: 250, y: 420 },
            { x: 300, y: 420 },
            { x: 350, y: 420 },
            { x: 500, y: 420 }
        ];
    },

    preload: function() {
        this.load.image("sky03", "assets/background03.png");
    },

    create: function() {
        console.log("LEVEL 03");
       this.add.image(0, 0, "sky03").setOrigin(0, 0);

       var self = this;

       var self = this;
       var restart = this.physics.add.sprite(50,50,"restart").setInteractive();
       restart.on('pointerdown', function () {
           self.playerBig = false;
           self.playerWithDoor = false;
           self.openDoor = false;
           self.bigJumpedOnce = false;
           // backgroundSound03.stop();
           game.scene.stop("level03");
           game.scene.start("level03");
       });

       restart.body.allowGravity = false;

       platforms = this.physics.add.staticGroup();
       platforms.enableBody = true;
       this.platformsCoords.forEach(function(coord) {
           platforms.create(coord.x, coord.y, "green50");
       });

       floor = this.physics.add.staticGroup();
       floor.create(600, 500, "floor");

       doors = this.physics.add.sprite(600, 460, "door");

       doors.setCollideWorldBounds(true);

       sprite = this.physics.add.sprite(250, 200, "player");

       sprite.setCollideWorldBounds(true);

       cursors = this.input.keyboard.createCursorKeys();

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
           if (this.openDoor) {
               this.playerWithDoor = true;
           }
       };
    },

    update: function() {
        if (this.playerWithDoor && cursors.up.isDown) {
            console.log("yo");
            game.scene.stop("level03");
            game.scene.start("finalScene");
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
                    sprite.setVelocityY(-200);
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
                        sprite.setVelocityY(-300);
                        this.bigJumpedOnce = true;
                    }
                } else {
                    if (cursors.up.isDown && sprite.body.touching.down) {
                        sprite.setVelocityY(-300);
                    }
                }
            }
        }
    }
};

const finalScene = {
    key: "finalScene",
    active: false,
    renderToTexture: true, //?
    x: 64,
    y: 64,
    width: 1200,
    height: 495,

    preload: function() {
        this.load.spritesheet("buttonGoodbye", "assets/buttonGoodbye.png", {
            frameWidth: 245,
            frameHeight: 135
                    });
    },

    create: function(config){
        this.add.text(300,300,"YOOOOOOOOO00000000000OOOOO");
        player = this.physics.add.sprite(250, 200, "player");
        playerBig = this.physics.add.sprite(300, 200, "playerBig");

        var buttonGoodbye = this.physics.add.sprite(500,200,"buttonGoodbye").setInteractive();
        buttonGoodbye.body.allowGravity = false;
    },
};

    const gameConfig = {
        type: Phaser.AUTO,
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
        scene: [ menuScene, level01Scene, level02Scene, level03Scene, finalScene ],
        // pixelArt: false,
};


    var game = new Phaser.Game(gameConfig);
    game.scene.start('menu');
})();
