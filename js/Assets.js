class Sprite{
    
    constructor(path, box, boxes){
        this.setImage(path);
        if(box instanceof Box){
            this.box = box;
        }else{
            this.box = new Box(box);
        }
        this.boxes = boxes;//how many boxes (sprites) are there per row
        this.crow = 0;
        this.col = 0;
    }
    
    row(row = 0){
        this.crow = row;
        debug(this.crow);
        this.box.row(this.crow);
    }

    next(){
        this.col = this.col == this.boxes[this.row]-1 ? 0 : this.col+1;
        debug(this.col);
        this.box.col(this.col);
    }

    setImage(path){
        if(path instanceof Image){
            this.image = path;
        }else if(typeof path === "string"){
            this.image = new Image();
            this.image.src = path;
        }
        this.image.ready = false;
        this.image.addEventListener("load",function(){
            debug("Sprite "+this.src, true);
            this.ready = true;
        });
    }
    
    isReady(){
        return this.image.ready;
    }

}

class Box{
    constructor(x, y=false, w=false, h=false){
        if(typeof x === "object"){
            this.x = x.x;
            this.y = x.y;
            this.w = x.w;
            this.h = x.h;

            this.initvalues = x;
        }else if(typeof x === "number" && y && w && h){
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            
            this.initvalues = {x: x, y: y, w: w, h: h};
        }
    }

    row(index = 0){
        this.y = this.h*index;
        return this;
    }  
    col(index = 0){
        this.x = this.w*index;
        return this;
    }

}

class Sound{
    constructor(path){
        this.setAudio(path);
    }

    setAudio(path){
        this.audio = new Audio();
        this.audio.src = path;
        this.audio.ready = false;
        this.audio.addEventListener("canplaythrough", function(){
            debug("Sound "+this.src+" ready",true);
            this.ready = true;
        });
    }

    isReady(){
        return this.audio.ready;
    }

    loop(){
        if(typeof this.audio.loop === "boolean"){
            this.audio.loop = true;
        }else{
            this.audio.addEventListener("ended", function(){
                this.currentTime = 0;
            },false)
        }
    }

    vol(percent){
        this.audio.volume = percent/100;
    }

    play(){
        this.audio.play();
    }

    pause(){
        this.audio.pause();
    }
    
    stop(){
        this.pause();
        this.audio.currentTime = 0;
    }
}

class Character{
    constructor(sprite, pos, spritesdirections, stats = {speed: 3}){
        this.sprite = sprite;
        this.spritesdirections = spritesdirections; //format: {direction:rowindex} example: {"up":1,"down":2,"left":3,"right":4}
        this.stats = stats;
        this.pos = pos;
        this.pos.w = this.sprite.box.w*2;
        this.pos.h = this.sprite.box.h*2;
    }

    move(direction){
        debug(direction);
        switch(direction){
            case "up":
                this.pos.y -=this.stats.speed;
                break;
            case "down":
                this.pos.y +=this.stats.speed;
                break;
            case "left":
                this.pos.x-=this.stats.speed;
                break;
            case "right":
                this.pos.x+=this.stats.speed;
                break;
        }
        debug(this.pos);
        this.sprite.row(this.spritesdirections[direction]);
    }
}

class Enemy extends Character{

    constructor(sprite, pos, spritesdirection, movedirection){
        super(sprite, pos, spritesdirection);
        this.movedirection = movedirection;

    }
    move(){
        super.move(this.movedirection);
    }

}

class GameController{
    constructor(canvasid){
        this.dom = document.getElementById(canvasid);
        this.rect = this.dom.getBoundingClientRect();
        this.context = this.dom.getContext("2d");
        this.enemies = [];
    }

    setPlayerControls(up,down = false, left = false, right = false){
        if(typeof up === "string" && down && left && right){
            this.controls[up] = "up";
            this.controls[down] = "down";
            this.controls[left] = "left";
            this.controls[right] = "right";
        }else if(typeof up === "object"){
            this.controls = up;
        }
    }

    setPlayer(char){
        this.player = char;
    }

    addEnemy(enemy){
        this.enemies.push(enemy);
    }

    addRandomEnemy(list){
        
    }

    drawPlayer(){
        this.context.drawImage(
            this.player.sprite.image,
            this.player.sprite.box.x,
            this.player.sprite.box.y,
            this.player.sprite.box.w,
            this.player.sprite.box.h, 

            this.player.pos.x,
            this.player.pos.y,
            this.player.pos.w,
            this.player.pos.h 
        );
    }

    drawEnemy(index = 0){
        var e = this.enemies[index];
        this.context.drawImage(
            e.sprite.image,
            e.sprite.box.x,
            e.sprite.box.y,
            e.sprite.box.w,
            e.sprite.box.h,

            e.pos.x,
            e.pos.y,
            e.pos.w,
            e.pos.h
        );
        
    }

    drawScenario(){
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this.rect.width, this.rect.height);
    }

    movePlayer(){
        this.player.move(this.controls[window.key]);
    }

    loadSprites(sources){
        sources.forEach(function(e){
            new Sprite(e);
        });
    }

    loadSounds(sources){
        sources.forEach(function(e){
            new Sound(e);
        });
    }
    
    setBackgroundMusic(sound){
        this.bgmusic = sound;
        this.bgmusic.loop();
        this.bgmusic.vol(50);
    }

    setBackgroundPattern(sprite){
        this.background = this.context.createPattern(sprite.image, "repeat");
    }

    setup(assets){
        /* Assets's paramaters must have
            {   
                sprites: array,
                sounds: array,
                bgmusic: Sound,
                bgtexture: Sprite,
                playercontrols: object

            }
        */

        //event listeners for player controls
        window.addEventListener("keyup",function(){
            this.key = "";
        });
        window.addEventListener("keydown",function(e){
            this.key = e.key;
        });
        //load all assets at least once 
        this.loadSprites(assets.sprites);
        this.loadSounds(assets.sounds);
        //set background music        
        this.setBackgroundMusic(assets.bgmusic);
        //set background pattern texture
        this.setBackgroundPattern(assets.bgtexture);
        this.setPlayerControls(assets.playercontrols);
    }

    update(){
        this.movePlayer();
        this.drawScenario();
        this.drawPlayer();
        this.drawEnemy();
    }

}