import Phaser from 'phaser-ce'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    super(game, x, y, 'enemy')
    this.anchor.setTo(0.5)
    this.width = 80
    this.height = 80
    
    let redRand = game.rnd.integerInRange(0, 4)
    let greenRand = game.rnd.integerInRange(0, 4)
    let blueRand = game.rnd.integerInRange(0, 4)

    let color = Phaser.Color.getColor(
      255 * redRand / 4,
      255 * greenRand / 4,
      255 * blueRand / 4
    )
    console.log(color)
    this.tint = color;
  }

}
