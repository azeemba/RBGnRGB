/* globals __DEV__ */
import Phaser from 'phaser'
import ColorBar from '../sprites/ColorBar'
import Hero from '../sprites/Hero'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    this.redBar = new ColorBar({
      game: this.game,
      x: 100,
      y: this.world.height - 50,
      color: 'r'
    })
    this.greenBar = new ColorBar({
      game: this.game,
      x: this.world.width * 1 / 4 + 100,
      y: this.world.height - 50,
      color: 'g'
    })
    this.blueBar = new ColorBar({
      game: this.game,
      x: this.world.width * 2 / 4 + 100,
      y: this.world.height - 50,
      color: 'b'
    })

    this.preview = new Phaser.Sprite(
      this.game,
      this.world.width - 150,
      this.world.height - 100,
      'preview'
    )
    this.preview.width = 100
    this.preview.height = 100

    this.hero = new Hero({
      game: this.game,
      x: 100,
      y: 100
    })

    this.game.add.existing(this.preview)

    this.game.add.existing(this.hero)

    this.game.add.existing(this.redBar)
    this.game.add.existing(this.greenBar)
    this.game.add.existing(this.blueBar)
  }

  render () {
    if (__DEV__) {
      this.game.debug.inputInfo(32, 32)
    }

    let color = Phaser.Color.getColor(
      255 * this.redBar.data.level / 4,
      255 * this.greenBar.data.level / 4,
      255 * this.blueBar.data.level / 4
    )
    this.preview.tint = color
  }
}
