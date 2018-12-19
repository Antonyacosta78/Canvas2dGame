var assets = {
    enemies: [
        {
            sprite: "media/enemy_bottom.png",
            box: {y:0, x:0, w: 16, h: 24},
            spritesdirection: {down:0},
            boxes:[4],
            spawnedge: "top",
            movedirection:"down"
        },
        {
            sprite: "media/enemy_top.png",
            box: {y:0, x:0, w: 16, h: 23},
            spritesdirection: {up:0},
            boxes:[4],
            spawnedge:"bottom",
            movedirection:"up"
        },
        {
            sprite: "media/enemy_left.png",
            box: {y:0, x:0, w: 32, h: 23},
            spritesdirection: {left:0},
            boxes:[4],
            spawnedge:"right",
            movedirection:"left"
        },
        {
            sprite: "media/enemy_right.png",
            box: {y:0, x:0, w: 32, h: 23},
            spritesdirection: {right:0},
            boxes:[4],
            spawnedge:"left",
            movedirection:"right"
        },
    ],
    playercontrols: {
        "w":"up",
        "s":"down",
        "a":"left",
        "d":"right"
    },
    sprites: [
        "media/background.png",
        "media/enemy_top.png",
        "media/enemy_bottom.png",
        "media/enemy_left.png",
        "media/enemy_right.png"
    ],
    sounds: [
        "media/music.mp3",
        "media/death.wav",
        "media/pickup.wav"
    ],
    player: {
        sprite: "media/player.png",
        box: {w: 19, h: 27, y:0, x:0},
        boxes: [8,8,8,8,5],
        spritesdirection: {up:2, down:0, left:3, right:1, dead: 4}
     },
    bgmusic: new Sound("media/music.mp3"),
    bgtexture: new Sprite("media/background.png"),
    deathmusic: new Sound("media/death.wav"),
    item: new Sprite("media/item.png",{x:0, y:0, w:14, h:14},[1])
};

var controller = new GameController("canvas");
controller.setup(assets);
controller.dom.addEventListener("click",begin);

function mainloop(){
    if(controller.background===null){
        controller.setBackgroundPattern(assets.bgtexture);
    }
    
    if(controller.playerIsDead){
        controller.showgameover();
    }else{
        controller.update();
    }
    continueloop();
}
//sets interval to add new enemies
window.setInterval(function(){
    controller.addRandomEnemy();
},3000);
//sets interval to pop old enemies
window.setInterval(function(){
    controller.popEnemy();
},6000);

function continueloop(){
    window.requestAnimationFrame(mainloop);
}
function begin(){
    controller.bgmusic.play();
    dropclicklistener();
    mainloop();  
}
function dropclicklistener(){
    controller.dom.removeEventListener("click",begin);
}