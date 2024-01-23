class Example extends Phaser.Scene
{
    mouseY = 0;
    mouseX = 0;
    isDown = false;
    lastFired = 0;
    stats;
    speed;
    ship;
    bullets;

    preload ()
    {
        this.load.image('ship', 'assets/ship.png');
        this.load.image('bullet1', 'assets/bullet11.png');
    }

    create ()
    {
        class Bullet extends Phaser.GameObjects.Image
        {
            constructor (scene)
            {
                super(scene, 0, 0, 'bullet1');

                this.incX = 0;
                this.incY = 0;
                this.lifespan = 0;

                this.speed = Phaser.Math.GetSpeed(600, 1);
            }

            fire (x, y, ship_x, ship_y)
            {
                this.setActive(true);
                this.setVisible(true);

                //  Bullets fire from the middle of the screen to the given x/y
                //this.setPosition(400, 300);
                this.setPosition(ship_x, ship_y);

                const angle = Phaser.Math.Angle.Between(x, y, ship_x, ship_y);

                this.setRotation(angle);

                this.incX = Math.cos(angle);
                this.incY = Math.sin(angle);

                this.lifespan = 1000;
            }

            update (time, delta)
            {
                this.lifespan -= delta;

                this.x -= this.incX * (this.speed * delta);
                this.y -= this.incY * (this.speed * delta);

                if (this.lifespan <= 0)
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
        }

        this.bullets = this.add.group({
            classType: Bullet,
            maxSize: 50,
            runChildUpdate: true
        });

        this.ship = this.add.sprite(400, 300, 'ship').setDepth(1).setScale(0.4);

        this.input.on('pointerdown', pointer =>
        {

            this.isDown = true;
            this.mouseX = pointer.x;
            this.mouseY = pointer.y;

        });

        this.input.on('pointermove', pointer =>
        {

            this.mouseX = pointer.x;
            this.mouseY = pointer.y;

        });

        this.input.on('pointerup', pointer =>
        {

            this.isDown = false;

        });

        this.arrow = this.input.keyboard.createCursorKeys();
    }

    update (time, delta)
    {

        if (this.isDown && time > this.lastFired)
        {
            const bullet = this.bullets.get();
            bullet.setScale(0.2);

            if (bullet)
            {
                bullet.fire(this.mouseX, this.mouseY, this.ship.x, this.ship.y);

                this.lastFired = time + 50;
            }
        }

        this.ship.setRotation(Phaser.Math.Angle.Between(this.mouseX, this.mouseY, this.ship.x, this.ship.y) - Math.PI / 2);

        if (this.arrow.right.isDown) {
            // If the right arrow is pressed, move to the right
            this.ship.x += 3;
        } else if (this.arrow.left.isDown) {
            // If the left arrow is pressed, move to the left
            this.ship.x -= 3;
        } 
        
        // Do the same for vertical movements
        if (this.arrow.down.isDown) {
            this.ship.y += 3;
        } else if (this.arrow.up.isDown) {
            this.ship.y -= 3;
        } 

    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'game',
    scene: Example
};

const game = new Phaser.Game(config);
