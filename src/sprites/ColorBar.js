import Phaser from 'phaser'

let COLOR_NAME_MAP = {
  'r': 'redbar',
  'g': 'greenbar',
  'b': 'bluebar'
}


let LEGEND_COLOR = {
  'r': '#ed313a',
  'g': '#6cbd45',
  'b': '#2d9ad5'
}

let MAX_LEVELS_TO_FRAME = {
  2: [4, 3],
  3: [4, 1, 3],
  5: [4, 0, 1, 2, 3]
}

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, color, levels}) {
    let spriteName = COLOR_NAME_MAP[color]
    let START_FRAME = 4
    super(game, x, y, spriteName, START_FRAME)
    this.anchor.setTo(0.5)
    this.width = 140
    this.height = 40

    this.data.level = 0
    this.data.maxLevels = levels
    this.data.color = color // should be r/g/b

    let text = this.game.add.text(0, 100, this.data.color.toUpperCase())
    text.anchor.setTo(0.5)
    text.fontSize = 88
    text.font = 'Fredoka One'
    text.fill = LEGEND_COLOR[this.data.color]
    this.addChild(text)
  }

  step () {
    this.data.level = (this.data.level + 1) % this.data.maxLevels

    this.frame = MAX_LEVELS_TO_FRAME[this.data.maxLevels][this.data.level]
  }

  reset () {
    this.data.level = 0;
    this.frame = 4
  }
}
