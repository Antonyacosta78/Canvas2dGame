//for debug purposes only
sprite = "media/player.png";
box = new Box({w: 19, h: 27, y:0, x:0});
boxes = [8,8,8,8,5];
pos = {x: 100, y: 200};
spritesdirection = {up:2, down:0, left:3, right:1, dead: 4};

var char = new Character(new Sprite(sprite,box,boxes), pos, spritesdirection);
esprite = "enemy_bottom.png";
ebox = new Box({y:0, x:0, w: 16, h: 24});
epos =  {x:515, y: 189};
espritesdir = {down:0};


var foe = new Enemy(new Sprite(esprite,ebox,[4]), pos,espritesdir,"down");