var pixel = require("node-pixel"),
    firmata = require('firmata'),
    board = new firmata.Board('/dev/ttyUSB0', function(){
    strip = new pixel.Strip({
        pin:6, 
        length: 2,
        firmata:board,
        conroller: "FIRMATA",
    });
    strip.on("ready", function(){
        setTimeout(function(){
            strip.off();
            setTimeout(function(){
                strip.on();
            },3000);
        }
        ,3000);
        
    });
});
