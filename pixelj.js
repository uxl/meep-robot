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
          strip.color("#ff0000"); // turns entire strip red using a hex colour
          strip.show();      
        });
    });
