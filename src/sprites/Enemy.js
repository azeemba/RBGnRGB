import Phaser from 'phaser-ce'

let ONE_COLOR_ARRAY = ['r', 'g', 'b']

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, scale, colors_allowed, color_levels }) {
    super(game, x, y, 'enemy')
    this.anchor.setTo(0.5)

    this.scale.setTo(scale * 1.5, scale * 1.5)

    let maxVal = color_levels - 1
    let redRand = 255 * game.rnd.integerInRange(0, maxVal) / maxVal
    let greenRand = 255 * game.rnd.integerInRange(0, maxVal) / maxVal
    let blueRand = 255 * game.rnd.integerInRange(0, maxVal) / maxVal

    let color
    if (colors_allowed === 1) {
      let info = {r: 0, g: 0, b: 0}
      let winner = game.rnd.pick(ONE_COLOR_ARRAY)
      info[winner] = redRand // not really red
      color = this.makeColor(info)
    }
    else if (colors_allowed === 2) {
      let info = {r: redRand, g: greenRand, b: blueRand}
      let loser = game.rnd.pick(ONE_COLOR_ARRAY)
      info[loser] = 0
      color = this.makeColor(info)
    }
    else {
      color = Phaser.Color.getColor(redRand, greenRand, blueRand)
    }

    console.log(color)
    this.tint = color;

    this.direction = "right"
  }

  makeColor ({r, g, b}) {
    return Phaser.Color.getColor(r, g, b)
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
