var _DEBUG_ENABLED = true;

function debug(text, time = false){
    if(_DEBUG_ENABLED){
        if(time){
            console.log(text+" at time: "+(performance.now()/1000)+"s");
        }else{
            console.log(text);
        }
        
    }
}