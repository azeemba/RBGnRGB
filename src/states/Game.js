/* globals __DEV__ */
import Phaser from 'phaser'
import ColorBar from '../sprites/ColorBar'
import Hero from '../sprites/Hero'
import Enemy from '../sprites/Enemy'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.redBar = new ColorBar({
      game: this.game,
      x: 100,
      y: this.world.height - 50,
      color: 'r'
    })
    this.greenBar = new ColorBar({
      game: this.game,
      x: this.world.width * 1 / 4 + 100,
      y: this.world.height - 50,
      color: 'g'
    })
    this.blueBar = new ColorBar({
      game: this.game,
      x: this.world.width * 2 / 4 + 100,
      y: this.world.height - 50,
      color: 'b'
    })

    this.preview = new Phaser.Sprite(
      this.game,
      this.world.width - 150,
      this.world.height - 100,
      'preview'
    )
    this.preview.width = 100
    this.preview.height = 100

    this.hero = new Hero({
      game: this.game,
      x: 350,
      y: 300
    })

    this.game.add.existing(this.preview)
    this.game.add.existing(this.hero)

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.enable(this.hero, Phaser.Physics.ARCADE)

    this.weapon = this.game.add.weapon(30, 'bullet')
    this.weapon.bullets.enableBody = true;
    this.weapon.bullets.physicsBodyType = Phaser.Physics.ARCADE
    this.weapon.height = 5
    this.weapon.width = 5
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    this.weapon.fireRate = 250 // milliseconds
    this.weapon.bulletSpeed = 300
    this.weapon.bulletAngleOffset = 90
    this.weapon.trackSprite(this.hero, 14, 0)
    this.weapon.onFire.add(this.onWeaponFire, this)
    this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)

    let playerScale = 0.15
    this.hero.scale.setTo(playerScale, playerScale)

    this.weapon.bullets.setAll('scale.x', playerScale / 5)
    this.weapon.bullets.setAll('scale.y', playerScale / 5)
    this.cursors = this.input.keyboard.createCursorKeys()

    this.game.add.existing(this.redBar)
    this.game.add.existing(this.greenBar)
    this.game.add.existing(this.blueBar)


    //enemies
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true
    this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

    for (let i = 0; i < 10; i++) {
      this.enemies.add(new Enemy({game: this.game, x: 50 + (i * 70), y: 50}))
    }

    this.enemies.setAll('outOfBoundsKill', true)
    this.enemies.setAll('checkWorldBounds', true)
  
  }

  render () {
    if (__DEV__) {
      this.game.debug.inputInfo(32, 32)
    }

    let color = this.calculateColor()
    this.preview.tint = color
  }

  calculateColor () {
    let color = Phaser.Color.getColor(
      255 * this.redBar.data.level / 4,
      255 * this.greenBar.data.level / 4,
      255 * this.blueBar.data.level / 4
    )
    return color
  }

  onWeaponFire (bullet, weapon) {
    let color = this.calculateColor()
    bullet.tint = color
  }

  update () {
    this.hero.body.velocity.x = 0

    if (this.cursors.left.isDown) {
      this.hero.body.velocity.x = -200
      this.hero.walkLeft(this.weapon)
    }
    else if (this.cursors.right.isDown) {
      this.hero.body.velocity.x = 200
      this.hero.walkRight(this.weapon)
    }
    else {
      this.hero.idle()
    }

    if (this.fireButton.isDown) {
      this.weapon.fire()
    }
  
   this.game.physics.arcade.overlap(this.weapon.bullets, this.enemies, this.hitEnemy, null, this);

}

hitEnemy (player, enemies) {
        enemies.kill();
        console.log("Hit");
    }


}
