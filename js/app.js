// Enemies our player must avoid
var Enemy = function(index) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = Math.floor(Math.random() * 101 + index * 101);
    this.y = Math.floor(Math.random() * 80 + (index % 2) * 80 + 60);
    this.speed = Math.random() * 3 + 1.5;
    this.direction = 'right';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var speed = this.speed * dt * 60 * 0;
    this.x += this.speed;
    if (this.x >= 505) {
      this.x = -80;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), Math.floor(this.x), Math.floor(this.y));
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(canMove) {
    this.sprite = 'images/char-boy.png';
    this.x = 205;
    this.y = 320;
    this.speed = 2;
    this.canMove = canMove;
    this.won = false;
    this.secondsToResume = canMove ? 0 : 1;
};

// Update the players's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt, enemies) {
    var collision = this.checkCollisions(dt, enemies);

    if (collision === 'enemy' || collision === 'goal') {
        this.canMove = false;
    }

    if (collision === 'goal') {
        this.won = true;
    }

    if (collision !== 'none') {
        return;
    }

    var speed = this.speed * dt * 60;

    switch (this.direction) {
        case 'left':
            this.x -= speed;
            break;
        case 'up':
            this.y -= speed;
            break;
        case 'right':
            this.x += speed;
            break;
        case 'down':
            this.y += speed;
            break;
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle players actions acording to key pressed
Player.prototype.handleInput = function(direction) {
    this.direction = direction;
};

Player.prototype.checkCollisions = function(dt, enemies) {
    if (!this.direction) {
        return;
    }

    var speed = this.speed * dt * 60;
    var x = this.x;
    var y = this.y;

    switch (this.direction) {
      case 'left':
          x -= speed;
          break;
      case 'up':
          y -= speed;
          break;
      case 'right':
          x += speed;
          break;
      case 'down':
          y += speed;
          break;
    }

    // Check collisions against borders
    if (x < -15 || x > 420 || y > 400) {
        return 'world';
    }

    if (y < 40) {
        return 'goal';
    }

    // Check collisions against enemies
    var collisionWithEnemy = false;
    allEnemies.forEach(function(enemy) {
        if ((Math.abs(x - enemy.x) <= 50) &&
            (Math.abs(y - enemy.y) <= 40)) {
            collisionWithEnemy = true;
        }
    });

    if (collisionWithEnemy) {
        return 'enemy';
    }

    return 'none'
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    if (!player.canMove) {
        if (player.secondsToResume === 0) {
            player.canMove = true;
        }
        return;
    }

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (allowedKeys[e.keyCode]) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});
