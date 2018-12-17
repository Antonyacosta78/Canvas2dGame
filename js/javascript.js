/*----_CONSTANTS ------*/

var _DEFAULT_BACKGROUND = "background.png";
var _DEFAULT_ENEMY = "";
var	_MOVEMENT_SPEED = 5;
var _ASSETS_LOADED = 0;
var _DEFAULT_PLAYER_SPRITE = "player.png";
var _DEFAULT_PLAYER_BOX = {w: 19, h: 27, y:0, x:0};
var _DEFAULT_PLAYER_SPRITES_AMOUNT = 8;
var _DEFAULT_PLAYER_SPRITES_DIRECTION = {up:2, down:0, left:3, right:1, dead: 4};
var _DEFAULT_ITEM_BOX = {w: 14, h: 14, x: 0, y: 0};
var _DEFAULT_ITEM_SPRITE = "item.png";
var _FRAME_DELAY = 5;
var _SCORE_INCREMENT = 1000;

/*-----GLOBAL VARS------*/

var SCORE = 0;

function rand(min,max){
	return Math.floor(Math.random()*((max+1)-min)+min);
}

class Asset{
	constructor(type,name,folder = "media"){
			this.name = name;
			this.path = this.folder+"/"+this.name;
			switch(type.toLowerCase()){
				case "audio":
					this.file = new Audio();
					break;
				case "image":
					this.file = new Image();
					break;
			}
			this.file.src = this.path;
			this.file.onload = function(){ 
				_ASSETS_LOADED++;
			}
	}
	
	get file(){
		return this.file;
	}
	
	get source(){
		return this.file.src;
	}
	
}


class GameManipulator{
    constructor(context,rect){
        this.rect = rect;
        this.context = context;
		this.player;
		this.controls = {
			up: "w",
			down: "s",
			left: "a",
			right: "d"
		};
		this.enemies = [];
        this.item = new Item(this.rect);
		var img = new Asset("image",_DEFAULT_BACKGROUND);
		this.background = this.context.createPattern(img.file(),"repeat");
    }

	setPlayer(){
		var asset = new Asset("image",_DEFAULT_PLAYER_SPRITE);
		var center = {x: this.rect.w/2-_DEFAULT_PLAYER_BOX.w/2, y: this.rect.h/2-_DEFAULT_PLAYER_BOX.h/2}; 
		this.player = new Character(asset,center,this.rect,_DEFAULT_PLAYER_BOX,_DEFAULT_PLAYER_SPRITES_AMOUNT,_DEFAULT_PLAYER_SPRITES_DIRECTION);
	}
	
	drawCharacter(character){
		var c = character;
		this.context.drawImage(c.asset.file(), c.boxX(), c.boxY(), c.w(), c.h(), c.x(), c.y(), c.w(), c.h());
	}
	
    drawScenario(){
        this.context.fillStyle = this.background;
		this.context.fillRect(0, 0, this.rect.width, this.rect.height);
    }
	
	drawEnemies(){
       this.enemies.forEach(this.drawCharacter);   
	}
    
    drawPlayer(){
        this.drawCharacter(this.player);
    }
    
	movePlayer(key){
		this.player.move(key);
	}
	
	moveEnemies(){
		this.enemies.forEach(function(e){e.move()});
	}
	
    updatePlayerSprite(){
        this.player.updateSprite();
    }
    
    updateEnemiesSprites(){
        this.enemies.forEach(function(e){e.updateSprite()});
    }
    
	update(currentKey){
        //test colissions, move player, move enemies, draw scenario, update sprites, draw characters
        if(this.enemiesCollisions()){
            
        }else{
            
        }
        
	}
	
	colission(char1,char2){
		var b1 = char1.box, b2 = char2.box;
		return (b1.x+b1.w > b2.x && b1.x < b2.x+b2.w) && (b1.y+b1.h > b2.y && b1.y < b2.y+b2.w);
	}
	
	itemColission(){
        
    }
    
	enemiesColissions(){
		
	} /*------WIP------*/
	
}

class Character{
    constructor(asset,center,rect,box,spritesAmount,spritesDirection){
		this.rect = rect;
		this.asset = asset;
		this.currentCharacterCenter = center;
		this.box = box;
		this.frameCounter = 0; 
		this.spritesAmount = spritesAmount;
		this.controls = {
			up: "w",
			down: "s",
			left: "a",
			right: "d"
		};
		this.controls.sprites = spritesDirection;
    }
	get x(){
		return this.currentCharacterCenter.x;
	}
	
	get y(){
		return this.currentCharacterCenter.y;
	}
	
	get w(){
		return this.box.w;
	}
	
	get h(){
		return this.box.h;
	}
	
	get boxY(){
		return this.box.y;
	}
	
	get boxX(){
		return this.box.x;
	}
	
	setSpriteLine(line){
		this.box.y = this.box.h*line;
	}
	
	move(direction){
		var currentX = this.x();
		var currentY = this.y();
		var localmovespeed = _MOVEMENT_SPEED+2;
		
		switch(direction){
			case this.controls.up:
				currentY = Math.max(currentY-localmovespeed,0);
				this.setSpriteLine(this.controls.sprites.up);
				break;
			case this.controls.down:
				currentY = Math.min(currentY+localmovespeed,this.rect.height-this.h());
				this.setSpriteLine(this.controls.sprites.down);
				break;
			case this.controls.left:
				currentX = Math.max(currentX-localmovespeed,0);
				this.setSpriteLine(this.controls.sprites.left)
				break;
			case this.controls.right:
				currentX = Math.min(currentX+lovalmovespeed,this.rect.width-this.w());
				this.setSpriteLine(this.controls.sprites.right);
				break;
		}
		this.currentCharacterCenter = {x:currentX,y:currentY};
	}
	
	updateSprite(){
		var x = this.boxX()*Math.floor(this.frameCounter*_FRAME_DELAY);
		this.frameCounter = (this.frameCounter >= this.spritesAmount) ? 0 : this.framecounter+1;
	}
	
	
}
class Enemy extends Character{
	constructor(asset,center,rect,box,spritesAmount,spritesDirection,spawn){
        super(asset,center,rect,box,spritesAmount,spritesDirection);
		console.log(spawn);
		switch(spawn){
			case "top":
				this.direction = this.controls.down;
				this.currentCharacterCenter  = {x:rand(0,this.rect.width-6), y:0};
				break;
			case "down":
				this.direction = this.controls.up;
				this.currentCharacterCenter  = {x:rand(0,this.rect.width-6), y: this.rect.height-6};
				break;
			case "left":
				this.direction = this.controls.right;
				this.currentCharacterCenter  = {x:0, y:rand(0,this.rect.height-6)};
				break;
			case "right":
				this.direction = this.controls.left;
				this.currentCharacterCenter  = {x:this.rect.width-6, y:rand(0,this.rect.height-6)};
				break;                                                                                  		
		}
		//console.log(this.direction);
		//console.log(this.currentCharacterCenter);
    }
	
	move(){
		var	localmovespeed = _MOVEMENT_SPEED-4+_SPEED_INCREASE;
		var currentX = this.currentCharacterCenter.x;
		var currentY = this.currentCharacterCenter.y;
		
		switch(this.direction){
			case this.controls.up:
				currentY = currentY-localmovespeed;
				break;
			case this.controls.down:
				currentY = currentY+localmovespeed;
				break;
			case this.controls.left:
				currentX = currentX-localmovespeed;
				break;
			case this.controls.right:
				currentX = currentX+localmovespeed;
				break;
		}
		
		this.currentCharacterCenter = {x:currentX,y:currentY};
	}
}

class Item{
	constructor(rect,box = _DEFAULT_ITEM_BOX,asset = false){
        if(asset instanceof Asset){
            this.asset = asset;
        }else{
            this.asset = new Asset("image",_DEFAULT_ITEM_SPRITE);
        }
		this.rect = rect;
		this.box = box;
		this.spawnPoint = {x:rand(50,this.rect.width-50), y:rand(50,this.rect.height-50)};
	}
	
	get asset(){
		return this.asset.file();
	}
	
	
}

$(document).ready(function(){
    var $canvas = $("#canvas");
    var context = $canvas[0].getContext('2d');
	var rect = $canvas[0].getBoundingClientRect();
	var game = new GameManipulator(context,rect);
	var key = "";
	//binding for controls
	$(document).on('keydown',function(ev){key = ev.key}); 
   	$(document).on('keyup',function(){key = ""}); 
	
	var playerIndex = game.setCharacter("smile",{x:rect.width/2,y:rect.height/2});
	var foeIndex = game.setEnemy();
	setInterval(function(){
		foeIndex = game.setEnemy();
	},5000);
	
	drawScreen();
	function drawScreen(){
		
		game.start();
		game.moveCharacter(playerIndex,key);
		game.moveCharacter(foeIndex);
		window.requestAnimationFrame(drawScreen);
	}
	
});
 
