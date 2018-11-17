import Phaser from 'phaser'

let COLOR_NAME_MAP = {
  'r': 'redbar',
  'g': 'greenbar',
  'b': 'bluebar'
}

let KEY_MAP = {
  'r': Phaser.KeyCode.R,
  'g': Phaser.KeyCode.G,
  'b': Phaser.KeyCode.B
}

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, color }) {
    let spriteName = COLOR_NAME_MAP[color]
    super(game, x, y, spriteName, 4)
    this.level = 0
    this.color = color // should be r/g/b

    this.width = 40
    this.height = 140
    this.angle = 90

    // Mouse click handling
    this.inputEnabled = true
    this.events.onInputDown.add(this.step, this)

    // Keyboard handling
    this.key = this.game.input.keyboard.addKey(KEY_MAP[color])
    this.key.onDown.add(this.step, this)
  }

  step () {
    this.level = (this.level + 1) % 5

    if (this.level === 0) {
      this.frame = 4
    }
    else {
      this.frame = this.level - 1
    }
  }
}
