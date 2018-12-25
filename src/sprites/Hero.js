import Phaser from 'phaser-ce'

const IDLE = 'idle'
const WALK = 'walk'
const HURT = 'hurt'

function makeHiddenHalfScreenRect (graphic, game) {
  graphic.beginFill(0, 0.1)
  graphic.drawRect(0, 0, game.width / 2, game.height)
  graphic.endFill()
  graphic.visible = false
}

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

    this.damageSound = this.game.add.audio('s_damage')

    this.leftActiveGraphic = this.game.add.graphics(0, 0)
    makeHiddenHalfScreenRect(this.leftActiveGraphic, this.game)

    this.rightActiveGraphic = this.game.add.graphics(this.game.width / 2, 0)
    makeHiddenHalfScreenRect(this.rightActiveGraphic, this.game)
  }

  showUIFeedbackMobile ({left, right}) {
    if (!this.game.device.desktop) {
      this.leftActiveGraphic.visible = left
      this.rightActiveGraphic.visible = right
    }
  }

  walkLeft (weapon) {
    if (this.data.mode === HURT) {
      return
    }
    if (this.data.mode !== 'left') {
      this.changeAnimation(WALK, 20)
      this.data.mode = 'left'

      this.scale.x = Math.abs(this.scale.x) * -1
      weapon.trackSprite(this, -28, 0)
      this.showUIFeedbackMobile({left: true, right: false})
    }
  }

  walkRight (weapon) {
    if (this.data.mode === HURT) {
      return
    }
    if (this.data.mode !== 'right') {
      this.changeAnimation(WALK, 20)
      this.data.mode = 'right'

      weapon.trackSprite(this, 28, 0)
      this.scale.x = Math.abs(this.scale.x)

      this.showUIFeedbackMobile({left: false, right: true})
    }
  }

  idle () {
    if (this.data.mode === HURT) {
      return
    }
    if (this.data.mode !== IDLE) {
      this.changeAnimation(IDLE, 15)
      this.data.mode = IDLE

      this.showUIFeedbackMobile({left: false, right: false})
    }
  }

  hit () {
    this.damage(0.2)
    this.changeAnimation(HURT, 24, false)
    this.data.mode = HURT
    if (this.health > 0) {
      // this.damageSound.play()
    }
    setTimeout(() => {
      this.data.mode = undefined
      this.idle()
    }, 500)
  }

  changeAnimation (mode, fps, loop = true) {
    this.loadTexture(mode)
    this.animations.add(mode)
    this.animations.play(mode, fps, loop)
  }
}
