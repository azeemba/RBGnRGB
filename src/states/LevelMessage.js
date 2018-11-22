import Phaser from 'phaser'

let LEVEL_MESSAGE = [
  {
    title: 'Welcome to RGBnRBG',
    message: 'You are RBG and you need to destroy all ' +
      'the monsters by matching their RGB value.\n\n' +
      "Press 'R' or 'G' or 'B' on your keyboard or " +
      'click on the color meters to control the color.\n\n' +
      'Press spacebar to shoot.\n\n' +
      'Arrow keys to move.\n'
  },
  {
    title: '',
    message: 'Success! You finished the level!\n\n' +
             'Now the monsters may be combinations of up to 2 colors\n\n' +
             'It\'s difficult but RBG can handle it!'
  },
  {
    message: 'Woohoo! That was awesome!\n\n' +
             'But now the monsters may be a combination of all 3 colors ' +
             'and each color can have multiple levels!\n\n' +
             'Best of luck!'
  },
  {
    message: 'You finished the game! Thanks for playing!'
  }
]

export default class extends Phaser.State {
  init (level) {
    this.level = level
  }
  create () {
    this.banner = new Phaser.Sprite(
      this.game,
      this.world.width / 2,
      this.world.height / 2,
      'banner'
    )
    this.banner.width = 800
    this.banner.height = 600
    this.banner.anchor.setTo(0.5)
    this.game.add.existing(this.banner)

    let messageText = LEVEL_MESSAGE[this.level].message
    let text = this.game.add.text(0, 0, messageText)
    text.wordWrap = true
    text.wordWrapWidth = this.banner.width - 100
    text.fontSize = 32
    text.font = 'Fredoka One'
    text.fill = '#77bfa3'
    text.smoothed = false
    this.game.add.existing(text)

    text.alignIn(this.banner, Phaser.TOP_CENTER, 0, -70)

    let closeButton = new Phaser.Sprite(
      this.game,
      0,
      0,
      'x'
    )
    closeButton.width = 50
    closeButton.height = 50
    this.game.add.existing(closeButton)
    closeButton.alignIn(this.banner, Phaser.TOP_RIGHT, -20, -20)

    closeButton.inputEnabled = true
    closeButton.events.onInputDown.add(this.continue, this)
    this.game.input.keyboard.addCallbacks(this, this.continue)
  }

  continue () {
    if (this.level === LEVEL_MESSAGE.length-1) {
      console.log("No more levels")
      return
    }
    // looks like a phaser bug, neither of these work
    // this.game.input.keyboard.removeCallbacks()
    // this.game.input.keyboard.reset()
    this.game.input.keyboard.onDownCallback = null
    let clearWorld = true
    let clearCache = false
    this.state.start('Game', clearWorld, clearCache, this.level)
  }
}