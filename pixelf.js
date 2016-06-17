    var pixel = require("node-pixel"),
        firmata = require('firmata'),
        board = new firmata.Board('/dev/ttyACM0',function(){

        strip = new pixel.Strip({
            pin: 6, // this is still supported as a shorthand
            length: 4,
            firmata: board,
            controller: "FIRMATA",
        });

        strip.on("ready", function() {
            // do stuff with the strip here.
            strip.color("#ff0000"); // turns entire strip red using a hex colour
            strip.show(); 
        });
    });
