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
        strips: [ {pin: 6, length: 4},{pin: 5, length: 8},{pin: 3, length: 12} ], // this is preferred form for definition
        //color_order: pixel.COLOR_ORDER.GRB,
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
        console.log(strip);
         var p = strip.pixel(2);
         p.color("blue");
         strip.show();
   });
});
