var pixel = require("node-pixel");
var five = require("johnny-five");

var board = new five.Board();
var strip = null;

board.on("ready", function() {
console.log("board ready");
    //led stobe
    var led = new five.Led(13);
    led.strobe();
    
    
    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [ {pin: 6, length: 1}, ], // this is preferred form for definition
    });

    strip.on("ready", function() {
        console.log("strip ready");
        // do stuff with the strip here.
       // var p = strip.pixel(0);
       // p.color("#0000FF");
       // strip.show();

        strip.color("#ff0000"); // turns entire strip red using a hex colour
        console.log("set color");
        strip.show();
        console.log("set show");
    });
});
