var _DEBUG_ENABLED = false;
var _FRAME_DELAY = 5;
var _SCORE_INCREMENT = 100;

function debug(text, time = false){
    if(_DEBUG_ENABLED){
        if(time){
            console.log(text+" at time: "+(performance.now()/1000)+"s");
        }else{
            console.log(text);
        }
        
    }
}
function rand(min,max){
	return Math.floor(Math.random()*((max+1)-min)+min);
}

function captureKey(e){
        debug("Key pressed: "+e.key);
        window.key = e.key;
}

function decaptureKey(e){
    debug("Key unpressed");
    window.key = "";
}