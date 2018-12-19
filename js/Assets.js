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
        debug("sprite row: "+this.crow);
        this.box.row(this.crow);
    }

    next(){
        this.col = this.col >= (this.boxes[this.crow]-1)*_FRAME_DELAY ? 0 : this.col+1;
        debug(this.col);
        this.box.col(Math.floor(this.col/_FRAME_DELAY));
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

class Item{
    constructor(sprite){
        this.sprite = sprite;
        this.pos = {x:0,y:0};
        this.setPrintDimensions();
        this.hbcenter = {x: this.pos.x+this.pos.w/2, 
            y: this.pos.y+this.pos.h/2, r: this.pos.w/2};
        }

    setPos(x,y){
        this.pos.x = x;
        this.pos.y = y;
        this.hbcenter = {x: this.pos.x+this.pos.w/2, 
            y: this.pos.y+this.pos.h/2, r: this.pos.w/2};

    }

    setPrintDimensions(){
        this.pos.w = this.sprite.box.w*2;
        this.pos.h = this.sprite.box.h*2
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
        this.hbcenter = {x: this.pos.x+this.pos.w/2, y: this.pos.y+this.pos.h/2, r: this.pos.w/2};
    }

    move(direction){
        if(typeof direction !== "undefined"){
            debug("direction:"+direction);
            switch(direction){
                case "up":
                    this.pos.y -=this.stats.speed;
                    this.hbcenter.y -=this.stats.speed;
                    break;
                case "down":
                    this.pos.y +=this.stats.speed;
                    this.hbcenter.y +=this.stats.speed;                    
                    break;
                case "left":
                    this.pos.x-=this.stats.speed;
                    this.hbcenter.x-=this.stats.speed;
                    break;
                case "right":
                    this.pos.x+=this.stats.speed;
                    this.hbcenter.x+=this.stats.speed;
                    break;
            }
        }
        this.sprite.row(this.spritesdirections[direction]);
    }

    changeSprite(){
        this.sprite.next();
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
        this.playerIsDead = false;
        this.score = 0;
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

    addEnemy(index){
        debug("addEnemy index:"+index);
        var pos = {}; 
        switch(this.enemiesdata[index].spawnedge){
            case "top":
                pos = {x:rand(0,this.rect.width), y:-60};
                break;
            case "bottom":
                pos = {x:rand(0,this.rect.width), y:this.rect.height+30};
                break;
            case "left":
                pos = {x:-60, y:rand(0,this.rect.height)};
                break;
            case "right":
                pos = {x:this.rect.width+40, y:rand(0,this.rect.height)};
                break;
        }
        var enemy = new Enemy(
            new Sprite(
                this.enemiesdata[index].sprite,
                this.enemiesdata[index].box,
                this.enemiesdata[index].boxes
                ),
            pos, 
            this.enemiesdata[index].spritesdirection,
            this.enemiesdata[index].movedirection
        );
        this.enemies.push(enemy);
    }

    addRandomEnemy(){
        debug("addRandomEnemy");
        this.addEnemy(rand(0,this.enemiesdata.length-1));
    }

    drawPlayer(){
        debug("drawPlayer");
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
        debug("drawEnemy index:"+index);
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
        debug("drawScenario");
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this.rect.width, this.rect.height);
    }

    movePlayer(){
        debug("movePlayer");
        if(this.controls[window.key]==="up" && this.player.pos.y-this.player.stats.speed >= 0){
            this.player.move(this.controls[window.key]);
        }else if(this.controls[window.key] === "left" && this.player.pos.x-this.player.stats.speed >=0){
            this.player.move(this.controls[window.key]);
        }else if(this.controls[window.key] === "down" && this.player.pos.y+this.player.stats.speed <= this.rect.height-this.player.pos.h){
            this.player.move(this.controls[window.key]);
        }else if(this.controls[window.key] === "right" && this.player.pos.x+this.player.stats.speed <= this.rect.width-this.player.pos.w){
            this.player.move(this.controls[window.key]);
        }
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
        this.bgmusic.vol(70);
    }

    setDeathMusic(sound){
        this.deathmusic = sound;
        this.deathmusic.vol(70);
    }

    setBackgroundPattern(sprite){
        this.background = this.context.createPattern(sprite.image, "repeat");
    }

    changePlayerSprite(){
        this.player.changeSprite();
    }

    colission(c1,c2){
        var colx = false, coly = false;
        if(c1.hbcenter.x == c2.hbcenter.x){
            colx = true;
        }else{
            var min = c1.hbcenter.x < c2.hbcenter.x ? c1.hbcenter.x : c2.hbcenter.x;
            var max = c1.hbcenter.x > c2.hbcenter.x ? c1.hbcenter.x : c2.hbcenter.x;
            colx = (max-min < c1.hbcenter.r+c2.hbcenter.r);
        }

        if(c1.hbcenter.y == c2.hbcenter.y){
            coly = true;
        }else{
            var min = c1.hbcenter.y < c2.hbcenter.y ? c1.hbcenter.y : c2.hbcenter.y;
            var max = c1.hbcenter.y > c2.hbcenter.y ? c1.hbcenter.y : c2.hbcenter.y;
            coly = (max-min < c1.hbcenter.r+c2.hbcenter.r);
        }

        return (colx && coly);

    }

    popEnemy(){
        this.enemies.shift();
    }

    spawnItem(){
        this.item.setPos(
            rand(0,this.rect.width-this.item.sprite.box.w),
            rand(0,this.rect.height-this.item.sprite.box.h)
        );
    }

    drawItem(){
        this.context.drawImage(
            this.item.sprite.image,
            this.item.sprite.box.x,
            this.item.sprite.box.y,
            this.item.sprite.box.w,
            this.item.sprite.box.h,

            this.item.pos.x,
            this.item.pos.y,
            this.item.pos.w,
            this.item.pos.h
        );
    }

    drawScore(){
        this.context.font = "20px Arial";
        this.context.fillStyle = "black";
        this.context.fillText("Score: "+this.score, 20,20);
    }

    setup(assets){

        /* Assets's paramaters must have
            {   
                sprites: array,
                sounds: array,
                bgmusic: Sound,
                bgtexture: Sprite,
                playercontrols: object
                enemies: array with objects, objects must have {
                    sprite: string, 
                    box: object{x,y,w,h}, 
                    spritesdirection:object{
                        direction1:index1, 
                        direction2:index, 
                        ...}, 
                    boxes: array, 
                    spawnedge:string,
                    movedirection: string
                },
                player: object{
                    sprite: string,
                    box: object{x,y,w,h}
                    boxes: array,
                    spritesdirection: object{up,down,left,right,dead}
                }
                deathmusic: Sound

            }
        */
        
        //event listeners for player controls
        window.addEventListener("keyup",decaptureKey);
        window.addEventListener("keydown",captureKey);
        //show fancy screen pre game
        this.context.fillStyle = "black";
        this.context.fillRect(0,0,this.rect.width,this.rect.height);
        this.context.font = "40px Arial";
        this.context.fillStyle = "white";
        this.context.fillText("CLICK ON AREA TO START", 0, this.rect.height/5);

        //load all assets at least once 
        this.loadSprites(assets.sprites);
        this.loadSounds(assets.sounds);
        //copy enemies list
        this.enemiesdata = assets.enemies;
        //creates all enemies
        for(var i = 0; i< this.enemiesdata.length; i++){
            this.addEnemy(i);
        }
        //set background music        
        this.setBackgroundMusic(assets.bgmusic);
        //set death music
        this.setDeathMusic(assets.deathmusic);
        //set backgroundPattern
        this.setBackgroundPattern(assets.bgtexture);
        //set player's controls         
        this.setPlayerControls(assets.playercontrols);
        //sets item
        this.item = new Item(assets.item);
        //spawns item
        this.spawnItem();
        //sets playerposition to center
        var playerpos = {x: this.rect.width/2, y: this.rect.height/2};
        //sets player
        this.setPlayer(
            new Character(
                new Sprite(
                    assets.player.sprite,
                    assets.player.box,
                    assets.player.boxes
                ),
                playerpos,
                assets.player.spritesdirection,
                {speed: 5}
            )
        );        

    }

    gameover(){
        window.removeEventListener("keyup",decaptureKey);
        window.removeEventListener("keydown",captureKey);
        this.bgmusic.stop();
        this.deathmusic.play();
    }

    showgameover(){
        this.drawScenario();
        this.context.font = "60px Arial";
        this.context.fillStyle = "black";
        this.context.fillText("GAME OVER", this.rect.width/5, this.rect.height/5);

    }

    update(){
        if(!this.playerIsDead){
            this.enemies.forEach(function(e){
                e.changeSprite();
                e.move();
            });
            this.movePlayer();
            this.drawScenario();
            this.drawItem();
            this.changePlayerSprite();
            this.drawPlayer();
            if(this.colission(this.player, this.item)){
                this.score += _SCORE_INCREMENT;
                this.spawnItem();
            }
            for(var i = 0; i < this.enemies.length; i++){
                var colider = this.colission(this.player,this.enemies[i]);
                if(colider){
                    this.gameover();
                    this.playerIsDead = true
                }
                this.drawEnemy(i);
            }
            this.drawScore();

        }else{
            this.player.move("dead");
            this.drawScenario();
            this.changePlayerSprite();
            this.drawPlayer();
            for(var i = 0; i < this.enemies.length; i++){
                this.drawEnemy(i);
            }

        }
    }

}