import Phaser from 'phaser'

let LEVEL_MESSAGE = [
  {
    icon: 'gui_libra',
    iconSize: '100',
    message: 'You are RBG and you need to destroy all ' +
      'the monsters by matching their RGB values.\n\n' +
      "Press 'R' or 'G' or 'B' on your keyboard or " +
      'click on the color meters to control the color.\n\n' +
      'Press spacebar to shoot.\n\n' +
      'Arrow keys to move.\n'
  },
  {
    icon: 'gui_cup',
    iconSize: '200',
    message: 'Success! You finished the level!\n\n' +
             'Now the monsters may be combinations of up to 2 colors\n\n' +
             'It\'s difficult but RBG can handle it!'
  },
  {
    icon: 'gui_cup',
    iconSize: '200',
    message: 'Woohoo! That was awesome!\n\n' +
             'But now the monsters may be a combination of all 3 colors ' +
             'and each color can have multiple levels!\n\n' +
             'Best of luck!'
  },
  {
    iconSize: '300',
    icon: 'gui_victory',
    message: 'You finished the game! Thanks for playing!'
  },
  {
    iconSize: '300',
    icon: 'gui_skull',
    message: 'Oh no! You weren\'t able to finish the level! It\'s all good ' +
             'though, the real RBG got this.\n\n' +
             'In the meanwhile, you can try again!'

  }
]

export default class extends Phaser.State {
  static getFailedLevel () {
    return LEVEL_MESSAGE.length - 1
  }

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

    let levelObject = LEVEL_MESSAGE[this.level]

    let icon = this.game.add.sprite(0, 0, levelObject.icon)
    icon.height = levelObject.iconSize
    icon.width = levelObject.iconSize

    let messageText = levelObject.message
    let text = this.game.add.text(0, 0, messageText)
    text.wordWrap = true
    text.wordWrapWidth = this.banner.width - 100
    text.fontSize = 32
    text.font = 'Fredoka One'
    text.fill = '#8D5573' //'#654773' //'#77bfa3'
    text.smoothed = false
    this.game.add.existing(text)

    icon.alignIn(this.banner, Phaser.TOP_CENTER, 0, -20)
    text.alignIn(this.banner, Phaser.TOP_CENTER, 0, -20 - levelObject.iconSize)

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

    // Delay setting the close options in case the user is holding on to some keys from
    // previous level
    setTimeout(() => {
      closeButton.inputEnabled = true
      closeButton.events.onInputDown.add(this.continue, this)
      closeButton.input.useHandCursor = true
      this.game.input.onTap.add(this.continue, this)
      this.game.input.keyboard.addCallbacks(this, this.continue)
    }, 800)

  }

  continue () {
    if (this.level === LEVEL_MESSAGE.length - 2) {
      console.log('No more levels')
      return
    }
    else if (this.level === LEVEL_MESSAGE.length - 1) {
      this.level = 0
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
