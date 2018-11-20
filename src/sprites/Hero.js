import Phaser from 'phaser-ce'

const IDLE = 'idle'
const WALK = 'walk'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    super(game, x, y, IDLE)
    this.anchor.setTo(0.5)
    this.width = 150
    this.height = 150

    this.animations.add(IDLE)
    this.animations.play(IDLE, 15, true)
    this.data.mode = IDLE

    game.physics.arcade.enable(this)
    this.body.collideWorldBounds = true;
  }

  walkLeft (weapon) {
    if (this.data.mode !== 'left') {
      this.changeAnimation(WALK, 20)
      this.data.mode = 'left'

      this.scale.x = Math.abs(this.scale.x) * -1
      weapon.trackSprite(this, -14, 0)
    }
  }

  walkRight (weapon) {
    if (this.data.mode !== 'right') {
      this.changeAnimation(WALK, 20)
      this.data.mode = 'right'

      weapon.trackSprite(this, 14, 0)
      this.scale.x = Math.abs(this.scale.x)
    }
  }

  idle () {
    if (this.data.mode !== IDLE) {
      this.changeAnimation(IDLE, 15)
      this.data.mode = IDLE
    }
  }

  changeAnimation (mode, fps) {
    this.loadTexture(mode)
    this.animations.add(mode)
    let loop = true
    this.animations.play(mode, fps, loop)
  }
}
