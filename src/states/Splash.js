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
    this.load.image('banner', 'assets/images/banner.png')
    this.load.image('x', 'assets/images/x.png')
    this.load.image('preview', 'assets/images/preview.png')
    this.load.image('bullet', 'assets/images/bullet.png')
    this.load.image('enemy', 'assets/images/skull.png')
    this.load.image('drop_weapon', 'assets/images/drop_weapon.png')
    this.load.image('gui_libra', 'assets/images/gui_libra.png')
    this.load.image('gui_skull', 'assets/images/gui_skull.png')
    this.load.image('gui_cup', 'assets/images/gui_cup.png')
    this.load.image('gui_victory', 'assets/images/gui_victory.png')
    this.load.image('lives', 'assets/images/lives.png')
    let colors = ['redbar', 'bluebar', 'greenbar']
    for (let c of colors) {
      this.load.spritesheet(c, `assets/images/${c}sheet.png`,
          560, 160, 5, 0)
    }

    this.load.spritesheet('idle', 'assets/images/hero/idle_blink_anim.png',
      265, 282)
    this.load.spritesheet('walk', 'assets/images/hero/walking_anim.png',
      265, 290)
    this.load.spritesheet('hurt', 'assets/images/hero/hurt_anim.png',
      317, 295)

    this.load.audio('s_damage', 'assets/sounds/damage.wav')
    this.load.audio('s_enemy_die', 'assets/sounds/enemy_die.ogg')
    this.load.audio('s_fire', 'assets/sounds/fire.wav')
    this.load.audio('s_finish', 'assets/sounds/finish_level.wav')
    this.load.audio('s_game_over', 'assets/sounds/game_over.wav')
  }

  create () {
    let clearWorld = true
    let clearCache = false
    let level = 0
    this.state.start('LevelMessage', clearWorld, clearCache, level)
  }
}
