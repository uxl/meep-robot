var pixel = require("node-pixel");
var five = require("johnny-five");

var board = new five.Board(opts);
var strip = null;

board.on("ready", function() {

    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [ {pin: 6, length: 4}, ], // this is preferred form for definition
    });

    strip.on("ready", function() {
        // do stuff with the strip here.
        strip.color("#ff0000"); // turns entire strip red using a hex colour
        strip.show();
    });
});
