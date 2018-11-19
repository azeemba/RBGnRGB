/* globals __DEV__ */
import Phaser from 'phaser'
import ColorBar from '../sprites/ColorBar'

export default class extends Phaser.State {
  init () {}
  preload () {
  
    this.game.load.image('bullet', 'assets/images/bullet.png');
    this.game.load.image('ship', 'assets/images/ship.png');
}

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
    this.game.add.existing(this.preview)


//    this.sprite = this.game.add.sprite(350, 250, 'ship');


    this.sprite = new Phaser.Sprite(
	this.game,
	350,
	250,
	'ship'
    )
    this.game.add.existing(this.sprite);

    game.physics.startSystem(Phaser.Physics.P2JS)

   game.physics.enable(this.sprite, Phaser.Physics.P2JS)


    this.weapon = this.game.add.weapon(30, 'bullet');
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bulletSpeed = 400;
    this.weapon.bulletAngleOffset = 90;
    this.weapon.trackSprite(this.sprite, 14, 0);
    this.fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
   
    this.cursors = this.input.keyboard.createCursorKeys();

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

  update () {
   //this.sprite.body.velocity.x = 0;

    if (this.cursors.left.isDown)
    {
       this.sprite.body.velocity.x = -200;
    }
    else if (this.cursors.right.isDown)
    {
        this.sprite.body.velocity.x = 200;
    }

    if (this.fireButton.isDown)
    {
        this.weapon.fire();
    } 
  }



}
