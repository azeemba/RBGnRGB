/* globals __DEV__ */
import Phaser from 'phaser'
import ColorBar from '../sprites/ColorBar'
import Hero from '../sprites/Hero'
import Enemy from '../sprites/Enemy'
import LevelMessage from './LevelMessage'

const LEVEL_DATA = [
  {
    'level': 0,
    'colors_allowed': 1, // how many colors can be enabled together [1, 3]
    'color_levels': 2, // how many levels each color should have [2, 3, 5]
    enemyCount: 3
  },
  {
    'level': 1,
    'colors_allowed': 2, // how many colors can be enabled together [1, 3]
    'color_levels': 2, // how many levels each color should have [2, 3, 5]
    // other enemy stats
    enemyCount: 5
  },
  {
    'level': 2,
    'colors_allowed': 3, // how many colors can be enabled together [1, 3]
    'color_levels': 3, // how many levels each color should have [2, 3, 5]
    // other enemy stats
    enemyCount: -1
  }
]

export default class extends Phaser.State {
  init (level) {
    this.level = level
    this.levelData = LEVEL_DATA[level]
  }
  preload () {}

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.colorBarManager = new ColorBarManager(
      this.game,
      this.world,
      {
        'colors_allowed': this.levelData.colors_allowed,
        'color_levels': this.levelData.color_levels
      }
      );

    if (__DEV__) {
      this.colorBarManager.preview.inputEnabled = true
      this.colorBarManager.preview.events.onInputDown.add(
        () => this.finishLevel()
      )
    }
    this.game.input.onTap.add(() => this.weapon.fire())

    // hero
    this.hero = new Hero({
      game: this.game,
      x: 400,
      y: 700
    })

    this.playerScale = 0.30
    this.hero.scale.setTo(this.playerScale, this.playerScale)
    this.game.add.existing(this.hero)

    // bullets
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

    this.weapon.bullets.setAll('scale.x', this.playerScale / 6)
    this.weapon.bullets.setAll('scale.y', this.playerScale / 6)

    // enemies
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true
    this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

    for (let i = 0; i < 10; i++) {
      let enemy = new Enemy({
        game: this.game,
        x: this.world.width * i / 10 + 50,
        y: 50,
        scale: this.playerScale,
        colors_allowed: this.levelData.colors_allowed,
        color_levels: this.levelData.color_levels
      })
      this.enemies.add(enemy)
      enemy.events.onOutOfBounds.add(this.enemyOutOfBounds, this);
    }
    this.enemiesWeapon = this.game.add.weapon(-1, 'drop_weapon')
    this.enemiesWeapon.autofire = true
    this.enemiesWeapon.fireRate = 1500
    this.enemiesWeapon.fireRateVariance = 500
    this.enemiesWeapon.fireAngle = Phaser.ANGLE_DOWN
    this.enemiesWeapon.trackSprite(this.enemies.getAt(0))
    this.enemiesWeapon.onFire.add((bullet) => {
      bullet.tint = this.enemiesWeapon.trackedSprite.tint
      let firer = this.game.rnd.pick(this.enemies.children.filter(e => e.alive))
      this.enemiesWeapon.trackSprite(firer)
      this.enemiesWeapon.trackOffset.y = firer.width/2
    })

    this.enemyMoveCount = 0
    this.enemies.setAll('checkWorldBounds', true)
  }

  render () {
    if (__DEV__) {
      this.game.debug.inputInfo(32, 32)
    }
  }

  calculateColor () {
    return this.colorBarManager.calculateColor()
  }

  onWeaponFire (bullet, weapon) {
    let color = this.calculateColor()
    bullet.tint = color
  }

  update () {
    this.hero.body.velocity.x = 0
    this.enemyMoveCount++

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
    this.game.physics.arcade.overlap(this.enemiesWeapon.bullets, this.hero, this.hitHero, null, this)

    for (let i = 0; i < this.enemies.length; ++i) {
      this.enemies.children[i].move()
    }

    if (this.levelData.enemyCount === -1) {
      let newEnemyDistance = parseInt((this.world.width * 1 / 10), 10)
      if (this.enemyMoveCount == newEnemyDistance) {
        let enemy = new Enemy({
          game: this.game,
          x: 50,
          y: 50,
          scale: this.playerScale,
          colors_allowed: this.levelData.colors_allowed,
          color_levels: this.levelData.color_levels})
        this.enemies.add(enemy)
        enemy.checkWorldBounds = true
        enemy.events.onOutOfBounds.add(this.enemyOutOfBounds, this);
        this.enemyMoveCount = 0

      }
    }

    if (!this.hero.alive) {
      // hero died!
      this.finishLevel(LevelMessage.getFailedLevel())
    }
  }

  hitEnemy (bullet, enemy) {
    console.log('bullet color:', bullet.tint)
    console.log('enemy color:', enemy.tint)
    if (enemy.tint === bullet.tint) {
      enemy.kill();
      console.log('Hit');
    }

    if (this.enemies.countLiving() === 0) {
      this.finishLevel()
    }
  }

  hitHero (hero, bullet) {
    console.log('Hero hit!')
    bullet.kill()
    hero.hit()
  }

  enemyOutOfBounds (enemy) {
    enemy.turn()
  }

  finishLevel (level) {
    if (!level) {
      level = this.level + 1
    }
    this.enemiesWeapon.autofire = false
    let clearWorld = true
    let clearCache = false
    this.state.start('LevelMessage', clearWorld, clearCache, level)
  }
}

let KEY_MAP = {
  'r': Phaser.KeyCode.R,
  'g': Phaser.KeyCode.G,
  'b': Phaser.KeyCode.B
}
class ColorBarManager {
  constructor (game, world, {colors_allowed, color_levels}) {
    this.game = game
    this.world = world
    this.colors_allowed = colors_allowed
    this.color_levels = color_levels

    this.redBar = new ColorBar({
      game: this.game,
      x: 100,
      y: this.world.height - 50,
      color: 'r',
      levels: this.color_levels
    })
    this.greenBar = new ColorBar({
      game: this.game,
      x: this.world.width * 1 / 4 + 100,
      y: this.world.height - 50,
      color: 'g',
      levels: this.color_levels
    })
    this.blueBar = new ColorBar({
      game: this.game,
      x: this.world.width * 2 / 4 + 100,
      y: this.world.height - 50,
      color: 'b',
      levels: this.color_levels
    })

    this.addHandlers(this.redBar)
    this.addHandlers(this.greenBar)
    this.addHandlers(this.blueBar)
    this.game.add.existing(this.redBar)
    this.game.add.existing(this.greenBar)
    this.game.add.existing(this.blueBar)

    // preview
    this.preview = new Phaser.Sprite(
      this.game,
      this.world.width - 150,
      this.world.height - 100,
      'preview'
    )
    this.preview.width = 100
    this.preview.height = 100

    this.game.add.existing(this.preview)
    this.flush();
  }

  addHandlers (bar) {
    let color = bar.data.color
    bar.inputEnabled = true
    bar.input.useHandCursor = true
    bar.events.onInputDown.add(this.handleInput.bind(this, bar))
    // Keyboard handling
    let key = this.game.input.keyboard.addKey(KEY_MAP[color])
    key.onDown.add(this.handleInput.bind(this, bar))
  }

  calculateColor () {
    let divisor = this.color_levels - 1
    let color = Phaser.Color.getColor(
      255 * this.redBar.data.level / divisor,
      255 * this.greenBar.data.level / divisor,
      255 * this.blueBar.data.level / divisor
    )
    return color
  }

  handleInput (item) {
    let bars = [this.redBar, this.greenBar, this.blueBar]
    let nonItemBars = bars.filter((cur) => cur !== item)
    let nonItemNonZeros = nonItemBars.filter(
      (cur) => cur.data.level > 0)

    // it can't be greater because we keep bumpig it down
    if (this.colors_allowed === nonItemNonZeros.length) {
      nonItemNonZeros[0].reset()
    }
    item.step()
    this.flush()
  }

  flush () {
    this.preview.tint = this.calculateColor();
  }
}
