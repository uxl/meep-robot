var pixel = require("node-pixel"),
    five = require('johnny-five'),
    board = new five.Board(),
    strip = null;

    board.on("ready", function(){
        strip = new pixel.Strip({
            board:this,
            controller: "FIRMATA",
            strips:[{pin:6, length: 2},],
        });
        strip.on("ready", function(){
            setTimeout(function(){
                strip.off();
                setTimeout(function(){
                 strip.on();
                },3000);
            },3000);       
        });
    });
