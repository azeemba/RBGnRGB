import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('mushroom', 'assets/images/mushroom2.png')
    this.load.image('preview', 'assets/images/preview.png')
    this.load.image('bullet', 'assets/images/bullet.png')
    let colors = ['redbar', 'bluebar', 'greenbar']
    for (let c of colors) {
      this.load.spritesheet(c, `assets/images/${c}sheet.png`,
          560, 160, 5, 0)
    }

    this.load.spritesheet('hero', 'assets/images/hero/idle_blink_anim.png',
      265, 282)
  }

  create () {
    this.state.start('Game')
  }
}
