/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import ColorBar from '../sprites/ColorBar'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    const bannerText = 'Phaser + ES6 + Webpack'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.redBar = new ColorBar({
      game: this.game,
      x: 150,
      y: this.world.height - 100,
      color: 'r'
    })
    this.blueBar = new ColorBar({
      game: this.game,
      x: this.world.width * 1 / 4 + 150,
      y: this.world.height - 100,
      color: 'b'
    })
    this.greenBar = new ColorBar({
      game: this.game,
      x: this.world.width * 2 / 4 + 150,
      y: this.world.height - 100,
      color: 'g'
    })

    this.game.add.existing(this.redBar)
    this.game.add.existing(this.greenBar)
    this.game.add.existing(this.blueBar)

    // set up keys
    self.rKey = this.game.input.keyboard.addKey(Phaser.KeyCode.R)
    self.rKey.onDown.add(this.redBar.step, this.redBar)
  }

  render () {
    if (__DEV__) {
      this.game.debug.inputInfo(32, 32)
    }
  }
}
