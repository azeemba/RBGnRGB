import Phaser from 'phaser-ce'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, scale }) {
    super(game, x, y, 'enemy')
    this.anchor.setTo(0.5)

    this.scale.setTo(scale * 1.5, scale * 1.5)

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

    this.direction = "right"
  }

  move () {
  	if (this.direction == "right") {
  		this.x = this.x + 1
  	}
  	else if (this.direction == "left") {
  		this.x = this.x - 1
  	}
  }

  turn () {
  	this.y = this.y + 70
  	if (this.direction == "right") {
  		this.direction = "left"
  		this.x = this.x - 50
  	}
  	else if (this.direction == "left") {
  		this.direction = "right"
  		this.x = this.x + 50
  	}
  }
}
