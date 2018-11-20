import Phaser from 'phaser-ce'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    super(game, x, y, 'enemy')
    this.anchor.setTo(0.5)
    this.width = 40
    this.height = 40
  }

}
