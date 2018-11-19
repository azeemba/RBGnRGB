import Phaser from 'phaser-ce'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    super(game, x, y, 'hero')
    this.anchor.setTo(0.5)
    this.width = 150
    this.height = 150

    this.animations.add('idle')
    this.animations.play('idle', 15, true)
  }
}
