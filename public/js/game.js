(function() {
    const menuScene = {
        key: "menu",
        active: true,
        renderToTexture: true,

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

        create: function(config) {
            this.add.text(380, 200, "Welcome to Castle Bubble");
            this.add.text(330, 220, "Don't forget to eat your fruit kids");

            var buttons = this.physics.add
                .sprite(500, 370, "buttonStart")
                .setInteractive();
            buttons.setCollideWorldBounds(true);
            buttons.setBounce(0.4);
            buttons.on("pointerdown", function() {
                game.scene.stop("menu");
                game.scene.start("level01");
            });
            buttons.body.allowGravity = false;
        }
    };

    const level01Scene = {
        key: "level01",
        active: false,
        renderToTexture: true,

        init: function(config) {
            var playerBig = false;
            var playerWithDoor = false;
            var openDoor = false;
            var bigJumpedOnce = false;
            var playBackground = true;

            this.coinsCoords = [
                // { x: 250, y: 450 },{ x: 250, y: 450 },{ x: 250, y: 450 },
                { x: 400, y: 20 },{ x: 625, y: 25 },{ x: 1150, y: 25 }
            ];

            this.platformsCoords = [
                { x: 25, y: 250 },{ x: 75, y: 250 },{ x: 480, y: 365 },{ x: 430, y: 365 },
                { x: 380, y: 375 },{ x: 330, y: 375 },{ x: 280, y: 385 },{ x: 230, y: 385 },
                { x: 180, y: 385 },{ x: 130, y: 385 },{ x: 130, y: 435 },{ x: 130, y: 485 },

                { x: 1080, y: 474 },{ x: 1130, y: 474 },{ x: 1180, y: 474 },{ x: 1080, y: 250 },
                { x: 1130, y: 250 },{ x: 1180, y: 250 }
            ];
            this.miniPlatformsCoords = [
                { x: 105, y: 231 },{ x: 115, y: 234 },{ x: 125, y: 237 },{ x: 135, y: 240 },
                { x: 140, y: 243 },{ x: 145, y: 246 },{ x: 150, y: 249 },{ x: 155, y: 252 },
                { x: 160, y: 255 },{ x: 165, y: 258 },{ x: 170, y: 261 },{ x: 175, y: 264 },
                { x: 180, y: 267 },{ x: 185, y: 270 },{ x: 190, y: 273 },{ x: 195, y: 276 },
                { x: 200, y: 279 },{ x: 205, y: 282 },{ x: 210, y: 285 },{ x: 215, y: 288 },
                { x: 225, y: 291 },{ x: 235, y: 294 },{ x: 245, y: 297 },{ x: 255, y: 300 },
                { x: 265, y: 303 },{ x: 275, y: 306 },{ x: 285, y: 309 },{ x: 295, y: 312 },
                { x: 305, y: 315 },{ x: 315, y: 318 },{ x: 325, y: 321 },{ x: 335, y: 323 },
                { x: 345, y: 326 },{ x: 355, y: 329 },{ x: 365, y: 331 },{ x: 375, y: 334 },
                { x: 385, y: 335 },{ x: 395, y: 336 },{ x: 405, y: 337 },{ x: 415, y: 338 },
                { x: 425, y: 339 },{ x: 435, y: 340 },{ x: 445, y: 341 },{ x: 455, y: 342 },
                { x: 465, y: 343 },{ x: 475, y: 344 },{ x: 485, y: 345 },{ x: 495, y: 346 },
                { x: 505, y: 347 },{ x: 515, y: 347 },{ x: 525, y: 347 },{ x: 535, y: 347 },
                { x: 545, y: 347 },{ x: 545, y: 357 },{ x: 545, y: 367 },{ x: 545, y: 378 },

                { x: 535, y: 378 },{ x: 525, y: 378 },{ x: 515, y: 378 },{ x: 505, y: 378 },

                { x: 330, y: 498 },{ x: 340, y: 495 },{ x: 350, y: 492 },{ x: 360, y: 490 },
                { x: 370, y: 488 },{ x: 380, y: 486 },{ x: 390, y: 484 },{ x: 400, y: 482 },
                { x: 410, y: 480 },{ x: 420, y: 478 },{ x: 430, y: 476 },{ x: 440, y: 474 },
                { x: 450, y: 472 },{ x: 460, y: 470 },{ x: 470, y: 468 },{ x: 480, y: 466 },
                { x: 490, y: 463 },{ x: 500, y: 460 },{ x: 510, y: 457 },{ x: 520, y: 454 },
                { x: 530, y: 451 },{ x: 540, y: 448 },{ x: 550, y: 445 },{ x: 560, y: 442 },
                { x: 570, y: 439 },{ x: 580, y: 436 },{ x: 590, y: 433 },{ x: 600, y: 430 },
                { x: 610, y: 427 },{ x: 620, y: 424 },{ x: 630, y: 421 },{ x: 640, y: 418 },
                { x: 645, y: 415 },{ x: 650, y: 412 },{ x: 655, y: 409 },{ x: 660, y: 406 },
                { x: 665, y: 403 },{ x: 670, y: 400 },{ x: 675, y: 397 },{ x: 680, y: 394 },
                { x: 685, y: 391 },{ x: 690, y: 388 },{ x: 695, y: 385 },{ x: 700, y: 382 },
                { x: 705, y: 379 },{ x: 710, y: 376 },{ x: 715, y: 373 },{ x: 720, y: 370 },
                { x: 725, y: 367 },{ x: 730, y: 364 },{ x: 735, y: 361 },{ x: 740, y: 357 },
                { x: 745, y: 354 },{ x: 750, y: 351 },{ x: 760, y: 348 },{ x: 770, y: 345 },
                { x: 780, y: 345 },{ x: 790, y: 345 },{ x: 800, y: 345 },{ x: 810, y: 345 },
                { x: 780, y: 345 },{ x: 790, y: 345 },{ x: 800, y: 345 },{ x: 810, y: 345 },
                { x: 820, y: 345 },{ x: 830, y: 345 },{ x: 840, y: 348 },{ x: 850, y: 351 },
                { x: 855, y: 354 },{ x: 860, y: 357 },{ x: 865, y: 360 },{ x: 870, y: 363 },
                { x: 875, y: 366 },{ x: 880, y: 369 },{ x: 885, y: 371 },{ x: 890, y: 374 },
                { x: 895, y: 377 },{ x: 900, y: 380 },{ x: 905, y: 383 },{ x: 910, y: 387 },
                { x: 915, y: 390 },{ x: 920, y: 393 },{ x: 925, y: 396 },{ x: 930, y: 399 },
                { x: 935, y: 402 },{ x: 940, y: 405 },{ x: 945, y: 408 },{ x: 950, y: 411 },
                { x: 955, y: 414 },{ x: 960, y: 417 },{ x: 965, y: 420 },{ x: 970, y: 423 },
                { x: 975, y: 426 },{ x: 980, y: 429 },{ x: 985, y: 431 },{ x: 990, y: 434 },
                { x: 995, y: 437 },{ x: 1000, y: 440 },{ x: 1005, y: 443 },{ x: 1010, y: 446 },
                { x: 1020, y: 449 },{ x: 1030, y: 452 },{ x: 1040, y: 454 },{ x: 1050, y: 454 }
            ];
        },

        preload: function() {

            this.load.audio(
                "backgroundSound01",
                "assets/audio/backgroundSound01.mp3"
            );
            this.load.audio("coinSound", "assets/audio/coinSound.mp3");
            this.load.audio("appleSound", "assets/audio/appleSound.mp3");
            this.load.audio("doorSound", "assets/audio/doorSound.mp3");

            this.load.image("sky01", "assets/background01.png");
            this.load.image("section01", "assets/section01.png");
            this.load.image("floor", "assets/floortest.png");
            this.load.image("green50", "assets/green50.png");
            this.load.image("green10", "assets/green10.png");
            this.load.image("coin", "assets/coin.png");
            this.load.image("mushroom", "assets/mushroom.png");
            this.load.image("door", "assets/door.png");
            this.load.image("doorOpen", "assets/doorOpen.png");

            this.load.spritesheet("apple", "assets/apple.png", {
                frameWidth: 30,
                frameHeight: 30
            });

            this.load.spritesheet("restart", "assets/restart.png", {
                frameWidth: 50,
                frameHeight: 50
            });
        },

        create: function() {

            var backgroundSound01 = this.sound.add("backgroundSound01", {
                loop: true
            });
            backgroundSound01.play();

            var coinSound = this.sound.add("coinSound");
            var appleSound = this.sound.add("appleSound");
            var doorSound = this.sound.add("doorSound");

            platforms = this.physics.add.staticGroup();
            platforms.enableBody = true;
            this.platformsCoords.forEach(function(coord) {
                platforms.create(coord.x, coord.y, "green50");
            });
            this.miniPlatformsCoords.forEach(function(coord) {
                platforms.create(coord.x, coord.y, "green10");
            });

            floor = this.physics.add.staticGroup();
            floor.create(600, 500, "floor");

            this.add.image(0, 0, "sky01").setOrigin(0, 0);
            doors = this.physics.add.sprite(200, 460, "door");
            doors.setCollideWorldBounds(true);

            sprite = this.physics.add.sprite(280, 270, "player");

            sprite.setCollideWorldBounds(true);

            this.add.image(0, 0, "section01").setOrigin(0, 0);

            var self = this;
            var restart = this.physics.add
                .sprite(50, 50, "restart")
                .setInteractive();
            restart.on("pointerdown", function() {
                self.playerBig = false;
                self.playerWithDoor = false;
                self.openDoor = false;
                self.bigJumpedOnce = false;
                backgroundSound01.stop();
                game.scene.stop("level01");
                game.scene.start("level01");
            });

            restart.body.allowGravity = false;

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

            apples = this.physics.add.sprite(1150, 380, "apple");
            apples.body.allowGravity = false;

            mushrooms = this.physics.add.group();
            mushrooms.create(50, 215, "mushroom");

            coins = this.physics.add.group();

            this.coinsCoords.forEach(function(coord) {
                coins.create(coord.x, coord.y, "coin");
            });

            this.physics.add.collider(sprite, platforms);
            this.physics.add.collider(sprite, floor);

            this.physics.add.collider(coins, platforms);
            this.physics.add.collider(coins, floor);

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
                coinSound.play();
                coin.disableBody(true, true);

                if (coins.countActive(true) === 0) {
                    doors.setTexture("doorOpen", 0, false);
                    this.openDoor = true;
                    doorSound.play();
                }
            }
            function collectapple(sprite, apple) {
                appleSound.play();
                sprite.setVelocityY(-100);
                apple.disableBody(true, true);
                this.playerBig = true;
                sprite.setTexture("playerBig", 0, false);
            }
            function collectmushroom(sprite, mushroom) {
                appleSound.play();
                mushroom.disableBody(true, true);
                sprite.setTexture("player", 0, false);
                this.playerBig = false;
            }

            function enterDoor(sprite, doors) {
                if (this.openDoor) {
                    this.playerWithDoor = true;
                }
            }
        },

        update: function() {
            if (
                this.playerWithDoor &&
                cursors.up.isDown &&
                sprite.x > 180 &&
                sprite.x < 220 &&
                sprite.y > 400
            ) {
                this.sound.sounds[0].stop();
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
                    if (cursors.up.isDown && sprite.body.touching.down) {
                        sprite.setVelocityY(-350);
                    }
                }
            }
        }
    };
    const level02Scene = {
        key: "level02",
        active: false,
        renderToTexture: true,

        init: function(config) {
            var playerBig = false;
            var playerWithDoor = false;
            var openDoor = false;

            this.coinsCoords = [
                { x: 900, y: 475 },{ x: 330, y: 380 },{ x: 50, y: 370 }
                // { x: 330, y: 300 },{ x: 330, y: 300 },{ x: 330, y: 300 }
            ];

            this.platformsCoords = [
                { x: 220, y: 360 },{ x: 270, y: 360 },{ x: 320, y: 360 },{ x: 370, y: 360 },
                { x: 420, y: 360 },

                { x: 220, y: 150 },{ x: 270, y: 150 },{ x: 320, y: 150 },{ x: 370, y: 150 },
                { x: 420, y: 150 }
            ];

            this.miniPlatformsCoords = [
                { x: 5, y: 300 },{ x: 15, y: 300 },{ x: 25, y: 280 },{ x: 35, y: 260 },
                { x: 45, y: 240 },{ x: 55, y: 220 },{ x: 75, y: 220 },{ x: 95, y: 220 },
                { x: 200, y: 180 },{ x: 200, y: 190 },{ x: 200, y: 200 },{ x: 200, y: 210 },
                { x: 210, y: 180 },{ x: 210, y: 190 },{ x: 210, y: 200 },{ x: 210, y: 210 },
                { x: 210, y: 220 },{ x: 210, y: 230 },{ x: 210, y: 240 },{ x: 210, y: 250 },

                { x: 5, y: 410 },{ x: 15, y: 410 },{ x: 25, y: 410 },{ x: 35, y: 410 },
                { x: 45, y: 410 },{ x: 55, y: 410 },{ x: 65, y: 410 },{ x: 75, y: 410 },
                { x: 85, y: 410 },{ x: 95, y: 410 },{ x: 95, y: 420 },{ x: 95, y: 430 },
                { x: 95, y: 440 },

                { x: 5, y: 200 },{ x: 15, y: 200 },{ x: 25, y: 200 },{ x: 35, y: 200 },
                { x: 45, y: 200 },{ x: 55, y: 200 },{ x: 65, y: 200 },{ x: 75, y: 200 },
                { x: 85, y: 200 },{ x: 95, y: 200 },

                { x: 200, y: 110 },{ x: 210, y: 110 },{ x: 220, y: 110 },{ x: 230, y: 110 },
                { x: 240, y: 110 },{ x: 250, y: 110 },{ x: 260, y: 110 },{ x: 270, y: 110 },
                { x: 280, y: 110 },{ x: 290, y: 110 },{ x: 300, y: 110 },{ x: 310, y: 110 },
                { x: 320, y: 110 },{ x: 330, y: 110 },{ x: 340, y: 110 },{ x: 350, y: 110 },
                { x: 360, y: 110 },{ x: 370, y: 110 },{ x: 380, y: 110 },{ x: 390, y: 110 },
                { x: 400, y: 110 },{ x: 410, y: 110 },{ x: 420, y: 110 },{ x: 430, y: 110 },
                { x: 440, y: 110 },

                { x: 440, y: 380 },{ x: 440, y: 400 },{ x: 440, y: 420 },{ x: 440, y: 440 },

                { x: 440, y: 240 },{ x: 440, y: 220 },{ x: 440, y: 200 },{ x: 440, y: 180 },
                { x: 440, y: 160 },{ x: 440, y: 140 },{ x: 440, y: 120 },{ x: 440, y: 100 }
            ];
        },

        preload: function() {
            this.load.image("sky02", "assets/background02.png");
            this.load.image("section02", "assets/section02.png");
            this.load.audio(
                "backgroundSound02",
                "assets/audio/backgroundSound02.mp3"
            );
        },

        create: function() {
            var backgroundSound02 = this.sound.add("backgroundSound02", {
                loop: true
            });
            backgroundSound02.play();

            var coinSound = this.sound.add("coinSound");
            var appleSound = this.sound.add("appleSound");
            var doorSound = this.sound.add("doorSound");

            platforms = this.physics.add.staticGroup();
            platforms.enableBody = true;
            this.platformsCoords.forEach(function(coord) {
                platforms.create(coord.x, coord.y, "green50");
            });
            this.miniPlatformsCoords.forEach(function(coord) {
                platforms.create(coord.x, coord.y, "green10");
            });
            this.add.image(0, 0, "sky02").setOrigin(0, 0);

            floor = this.physics.add.staticGroup();
            floor.create(600, 500, "floor");

            doors = this.physics.add.sprite(330, 300, "door");
            doors.body.allowGravity = false;

            sprite = this.physics.add.sprite(30, 450, "player");

            sprite.setCollideWorldBounds(true);
            this.add.image(0, 0, "section02").setOrigin(0, 0);
            var self = this;
            var restart = this.physics.add
                .sprite(50, 50, "restart")
                .setInteractive();
            restart.on("pointerdown", function() {
                self.playerBig = false;
                self.playerWithDoor = false;
                self.openDoor = false;
                backgroundSound02.stop();
                game.scene.stop("level02");
                game.scene.start("level02");
            });

            restart.body.allowGravity = false;

            cursors = this.input.keyboard.createCursorKeys();

            apples = this.physics.add.sprite(1100, 400, "apple");
            apples.body.allowGravity = false;

            mushrooms = this.physics.add
                .staticGroup()
                .create(380, 95, "mushroom");

            coins = this.physics.add.staticGroup();
            this.coinsCoords.forEach(function(coord) {
                coins.create(coord.x, coord.y, "coin");
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
                coinSound.play();
                coin.disableBody(true, true);

                if (coins.countActive(true) === 0) {
                    doors.setTexture("doorOpen", 0, false);
                    this.openDoor = true;
                    doorSound.play();
                }
            }
            function collectapple(sprite, apple) {
                appleSound.play();
                sprite.setVelocityY(-100);
                apple.disableBody(true, true);
                this.playerBig = true;
                sprite.setTexture("playerBig", 0, false);
            }
            function collectmushroom(sprite, mushroom) {
                appleSound.play();
                mushroom.disableBody(true, true);
                sprite.setTexture("player", 0, false);
                this.playerBig = false;
            }
            function enterDoor(sprite, door) {
                if (this.openDoor) {
                    this.playerWithDoor = true;
                }
            }
        },

        update: function() {
            if (
                this.playerWithDoor &&
                cursors.up.isDown &&
                !this.playerBig &&
                sprite.x > 320 &&
                sprite.x < 340 &&
                sprite.y > 300 &&
                sprite.y < 320
            ) {
                this.sound.sounds[4].stop();
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
                    if (cursors.up.isDown && sprite.body.touching.down) {
                        sprite.setVelocityY(-360);
                    }
                }
            }
        }
    };

    const level03Scene = {
        key: "level03",
        active: false,
        renderToTexture: true,

        init: function(config) {
            var playerBig = false;
            var playerWithDoor = false;
            var openDoor = false;

            this.platformsCoords = [
                { x: -20, y: 350 },{ x: -20, y: 300 },{ x: -20, y: 200 },{ x: -20, y: 150 },
                { x: -20, y: 100 },{ x: -20, y: 50 },

                { x: 1220, y: 250 },{ x: 1220, y: 200 },{ x: 1220, y: 150 },{ x: 1220, y: 100 },
                { x: 1220, y: 50 },

                { x: 25, y: 420 },{ x: 75, y: 420 },{ x: 125, y: 420 },{ x: 200, y: 420 },
                { x: 200, y: 470 },{ x: 750, y: 420 },{ x: 750, y: 470 },

                { x: 25, y: 250 },{ x: 75, y: 250 },{ x: 125, y: 250 },{ x: 175, y: 250 },
                { x: 225, y: 250 },{ x: 275, y: 250 },{ x: 325, y: 250 },{ x: 375, y: 250 },

                { x: 25, y: 272 },{ x: 75, y: 272 },{ x: 125, y: 272 },{ x: 175, y: 272 },
                { x: 225, y: 272 },{ x: 275, y: 272 },{ x: 325, y: 272 },{ x: 375, y: 272 },

                { x: 200, y: 370 },{ x: 250, y: 370 },{ x: 300, y: 370 },{ x: 350, y: 370 },
                { x: 400, y: 370 },{ x: 450, y: 370 },{ x: 500, y: 370 },{ x: 550, y: 370 },
                { x: 600, y: 370 },{ x: 650, y: 370 },{ x: 700, y: 370 },{ x: 750, y: 370 },

                { x: 915, y: 320 },{ x: 920, y: 370 },{ x: 920, y: 420 },{ x: 920, y: 470 },
                { x: 970, y: 320 },{ x: 1020, y: 320 },{ x: 1070, y: 320 },{ x: 1120, y: 320 },
                { x: 1170, y: 320 }
            ];
            this.coinsCoords = [
                { x: 250, y: 200 },{ x: 420, y: 230 },{ x: 520, y: 320 }
            ];
        },

        preload: function() {
            var gameOver = false;
            this.load.image("sky03", "assets/background03.png");
            this.load.image("section03", "assets/section03.png");

            this.load.spritesheet("wolf", "assets/wolf.png", {
                frameWidth: 60,
                frameHeight: 30
            });

            this.load.audio(
                "backgroundSound03",
                "assets/audio/backgroundSound03.mp3"
            );
            this.load.audio("oldDoorSound", "assets/audio/oldDoorSound.mp3");
            this.load.audio("wolfSound", "assets/audio/wolfSound.mp3");
            this.load.audio("wolfBiteSound", "assets/audio/wolfBiteSound.mp3");
            this.load.audio("hurtSound", "assets/audio/wolfBiteSound.mp3");
        },

        create: function() {
            var backgroundSound03 = this.sound.add("backgroundSound03", {
                loop: true
            });
            backgroundSound03.play();
            var wolfSound = this.sound.add("wolfSound");
            wolfSound.play();
            var coinSound = this.sound.add("coinSound");
            var appleSound = this.sound.add("appleSound");
            var oldDoorSound = this.sound.add("oldDoorSound");
            var hurtSound = this.sound.add("hurtSound");
            var wolfBiteSound = this.sound.add("wolfBiteSound");

            this.anims.create({
                key: "rightWolf",
                frames: this.anims.generateFrameNumbers("wolf", {
                    start: 5,
                    end: 8
                }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: "leftWolf",
                frames: this.anims.generateFrameNumbers("wolf", {
                    start: 0,
                    end: 3
                }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: "turnWolf",
                frames: [{ key: "wolf", frame: 4 }],
                frameRate: 20
            });

            floor = this.physics.add.staticGroup();
            floor.create(100, 500, "floor");
            platforms = this.physics.add.staticGroup();
            platforms.enableBody = true;
            this.platformsCoords.forEach(function(coord) {
                platforms.create(coord.x, coord.y, "green50");
            });

            this.add.image(0, 0, "sky03").setOrigin(0, 0);

            doors = this.physics.add.sprite(1100, 260, "door");

            doors.setCollideWorldBounds(true);

            sprite = this.physics.add.sprite(20, 350, "player");

            this.add.image(0, 0, "section03").setOrigin(0, 0);

            var self = this;
            var restart = this.physics.add
                .sprite(50, 50, "restart")
                .setInteractive();
            restart.on("pointerdown", function() {
                self.playerBig = false;
                self.playerWithDoor = false;
                self.openDoor = false;
                backgroundSound03.stop();
                game.scene.stop("level03");
                game.scene.start("level03");
            });

            restart.body.allowGravity = false;

            wolf = this.physics.add.sprite(750, 320, "wolf");

            wolf.body.velocity.x = 150;

            apples = this.physics.add.staticGroup().create(760, 270, "apple");

            mushrooms = this.physics.add
                .staticGroup()
                .create(600, 335, "mushroom");

            coins = this.physics.add.staticGroup();
            this.coinsCoords.forEach(function(coord) {
                coins.create(coord.x, coord.y, "coin");
            });

            cursors = this.input.keyboard.createCursorKeys();

            this.physics.add.collider(wolf, platforms);
            this.physics.add.collider(doors, platforms);
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

            this.physics.add.overlap(sprite, wolf, hitWolf, null, this);
            function hitWolf(sprite, wolf) {
                this.physics.pause();
                sprite.setTint(0xff0000);
                sprite.anims.stop();
                wolf.anims.stop();
                gameOver = true;
                hurtSound.play();
                wolfBiteSound.play();
            }

            function collectcoin(sprite, coin) {
                coinSound.play();
                coin.disableBody(true, true);

                if (coins.countActive(true) === 0) {
                    doors.setTexture("doorOpen", 0, false);
                    this.openDoor = true;
                    oldDoorSound.play();
                }
            }
            function collectapple(sprite, apple) {
                appleSound.play();
                sprite.setVelocityY(-100);
                apple.disableBody(true, true);
                this.playerBig = true;
                sprite.setTexture("playerBig", 0, false);
            }
            function collectmushroom(sprite, mushroom) {
                appleSound.play();
                mushroom.disableBody(true, true);
                sprite.setTexture("player", 0, false);
                this.playerBig = false;
            }
            function enterDoor(sprite, door) {
                if (this.openDoor) {
                    this.playerWithDoor = true;
                }
            }
        },

        update: function() {
            if (
                this.playerWithDoor &&
                cursors.up.isDown &&
                !this.playerBig &&
                sprite.x > 1090 &&
                sprite.x < 1110 &&
                sprite.y > 250 &&
                sprite.y < 270
            ) {
                this.sound.sounds[8].stop();
                game.scene.stop("level03");
                game.scene.start("finalScene");
            } else {
                if (wolf.x < 200) {
                    wolf.setVelocityX(150);
                    wolf.anims.play("rightWolf");
                } else if (wolf.x > 750) {
                    wolf.setVelocityX(-150);
                    wolf.anims.play("leftWolf");
                }
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
                    if (cursors.up.isDown && sprite.body.touching.down) {
                        sprite.setVelocityY(-330);
                    }
                }
            }
        }
    };

    const finalScene = {
        key: "finalScene",
        active: false,

        preload: function() {
            this.load.spritesheet("buttonGoodbye", "assets/buttonGoodbye.png", {
                frameWidth: 260,
                frameHeight: 120
            });
        },

        create: function(config) {
            var buttonGoodbye = this.physics.add
                .sprite(500, 200, "buttonGoodbye")
                .setInteractive();
            buttonGoodbye.body.allowGravity = false;
        }
    };

    const gameConfig = {
        type: Phaser.AUTO,
        parent: "phaser-example",
        width: 1200,
        height: 495,
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 400 },
                debug: false
            }
        },
        scene: [menuScene, level01Scene, level02Scene, level03Scene, finalScene]
    };

    var game = new Phaser.Game(gameConfig);
    game.scene.start("menu");
})();
