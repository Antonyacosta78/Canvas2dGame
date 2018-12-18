var assets = {
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
        "media.pickup.wav"
    ],
    bgmusic: new Sound("media/music.mp3"),
    bgtexture: new Sprite("media/background.png")
};

var controller = new GameController("canvas");
controller.setup(assets);

function mainloop(){
    controller.update();
    window.requestAnimationFrame(mainloop);
}