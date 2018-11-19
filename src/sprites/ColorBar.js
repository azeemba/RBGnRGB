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

let LEGEND_COLOR = {
  'r': '#ed313a',
  'g': '#6cbd45',
  'b': '#2d9ad5'
}

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, color }) {
    let spriteName = COLOR_NAME_MAP[color]
    let START_FRAME = 4
    super(game, x, y, spriteName, START_FRAME)
    this.anchor.setTo(0.5)
    this.width = 140
    this.height = 40

    this.data.level = 0
    this.data.color = color // should be r/g/b

    // Mouse click handling
    this.inputEnabled = true
    this.events.onInputDown.add(this.step, this)

    // Keyboard handling
    this.data.key = this.game.input.keyboard.addKey(KEY_MAP[color])
    this.data.key.onDown.add(this.step, this)

    let text = this.game.add.text(0, 100, this.data.color.toUpperCase())
    text.anchor.setTo(0.5)
    text.fontSize = 88
    text.font = 'Fredoka One'
    text.fill = LEGEND_COLOR[this.data.color]
    this.addChild(text)
  }

  step () {
    this.data.level = (this.data.level + 1) % 5

    if (this.data.level === 0) {
      this.frame = 4
    }
    else {
      this.frame = this.data.level - 1
    }
  }
}
