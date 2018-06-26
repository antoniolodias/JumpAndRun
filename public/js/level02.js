(function() {
    var config = {
        //The config object is how you configure your Phaser Game.
        //rendering context that you want to use for your game
        //Phaser.AUTO which automatically tries to use WebGL,
        //but if the browser or device doesn't support it it'll
        //fall back to Canvas.
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 400 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var platforms;

    var game = new Phaser.Game(config);

    var tilePhysics = {};

    function preload() {
        // load the assets we need
        // this.load.image("sky", "assets/tutorial01things/sky.png");
        // the first parameter, also known as the asset key
        this.load.image("ground", "assets/tutorial01things/platform.png");
        this.load.image("star", "assets/tutorial01things/star.png");
        this.load.image("bomb", "assets/tutorial01things/bomb.png");
        this.load.spritesheet("dude", "assets/tutorial01things/dude.png", {
            frameWidth: 32,
            frameHeight: 48
        });
    }

    function create() {
        // he values 400 and 300 are the x and y coordinates of the image.
        //Phaser 3 all Game Objects are positioned based on their center by default.
        // Hint: You can use setOrigin to change this. For example the code:
        // this.add.image(0, 0, "sky").setOrigin(0, 0);
        //  would reset the drawing position of the image to the top-left.
        // this.add.image(400, 300, "sky");
        //images come on top of each other according to order
        // this.add.image(400, 300, "star");

        //his creates a new Static Physics Group and assigns it to the local variable platforms

        // ways for you to group together similar objects and control them all as one single unit.
        // You can also check for collision between Groups and other game objects.
        // Groups are capable of creating their own Game Objects via handy helper functions like create.
        // A Physics Group will automatically create physics enabled children, saving you some leg-work
        // in the process.
        platforms = this.physics.add.staticGroup();
        //there are two types of physics bodies: Dynamic and Static.

        platforms
            .create(400, 568, "ground")
            .setScale(2)
            .refreshBody();
        //refreshBody() is required because we have scaled a static physics body,
        //so we have to tell the physics world about the changes we made.

        platforms.create(600, 400, "ground");
        platforms.create(300, 250, "ground");
        platforms.create(800, 220, "ground");

        player = this.physics.add.sprite(0, 450, "dude");

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3
            }), // frames 0, 1, 2 and 3
            frameRate: 10, // animation runs at 10 frames/second
            repeat: -1 //tells animation to repeat
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(player, platforms);

        cursors = this.input.keyboard.createCursorKeys(); //built-in Keyboard manager

        stars = this.physics.add.group({
            //group configuration object has 3 parts
            key: "star",
            //First it sets the texture key to be the star image
            repeat: 11,
            //repeat value to be 11. Because it creates 1 child automatically,
            //repeating 11 times means we'll get 12 in total
            setXY: { x: 12, y: 20, stepX: 70 }
            //Each child will be placed starting at x: 12, y: 0 and with an x step of 70
        });

        stars.children.iterate(function(child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); //random Y bounce value between 0.4 and 0.8.
        });

        this.physics.add.collider(stars, platforms);

        //check to see if the player overlaps with a star or not:
        this.physics.add.overlap(player, stars, collectStar, null, this);
        //This tells Phaser to check for an overlap between the player
        //and any star in the stars Group. If found then they are passed to the
        //'collectStar' function:
        function collectStar(player, star) {
            // the star has its physics body disabled and its parent Game Object
            // is made inactive and invisible, which removes it from display.
            star.disableBody(true, true);

            score += 10;
            scoreText.setText("Score: " + score);

            if (stars.countActive(true) === 0) {
                //Group method called countActive to see how many stars are left alive.
                stars.children.iterate(function(child) {
                    child.enableBody(true, child.x, 0, true, true);
                });

                var x =
                    player.x < 400
                        ? Phaser.Math.Between(400, 800)
                        : Phaser.Math.Between(0, 400);

                var bomb = bombs.create(x, 16, "bomb");
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bomb.allowGravity = false;
            }
        }

        var score = 0;
        var scoreText;
        scoreText = this.add.text(16, 16, "score: 0", {
            fontSize: "32px",
            fill: "#000"
        });

        bombs = this.physics.add.group();

        this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player, bombs, hitBomb, null, this);

        function hitBomb(player, bomb) {
            this.physics.pause();

            player.setTint(0xff0000);

            player.anims.play("turn");

            gameOver = true;
        }
    }

    function update() {
        if (cursors.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play("left", true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);

            player.anims.play("right", true);
        } else {
            player.setVelocityX(0);

            player.anims.play("turn");
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-350); //200 px/sec sq.
        }
    }
})();
