class Sprite{
    
    constructor(path, box, boxes){
        this.setImage(path);
        if(box instanceof Box){
            this.box = box;
        }else{
            this.box = new Box(box);
        }
        this.boxes = boxes;//how many boxes (sprites) are there per row
        this.row = 1;
        this.col = 1;
    }
    
    row(row){
        this.row = row;
        this.box.row(this.row);
    }

    next(){
        this.col = this.col == this.boxes[this.row] ? 1 : this.col+1;
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
            debug("Loaded "+this.src, true);
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

    row(index = 1){
        this.y = this.initvalues.y*index;
        return this;
    }  
    col(index = 1){
        this.x = this.initvalues.x*index;
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
    constructor(sprite, pos, spritesdirections, stats = {speed: 5}){
        this.sprite = sprite;
        this.spritesdirections = spritesdirections; //format: {direction:rowindex} example: {"up":1,"down":2,"left":3,"right":4}
        this.stats = stats;
        this.pos = pos;
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
            this.sprite.row(this.spritesdirections[direction]);
        }
    }
}
