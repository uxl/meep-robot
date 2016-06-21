var pixel = require("node-pixel");
var five = require("johnny-five");

var board = new five.Board();
var strip = null;
var fps = 30;

board.on("ready", function() {
console.log("board ready");
    //led stobe
    var led = new five.Led(13);
    led.on();


    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [   {pin: 6, length: 4},
                    {pin: 5, length: 8},
                    {pin: 3, length: 12},
                    {pin:10, length: 60}, 
                    ], // this is preferred form for definition
        //color_order: pixel.COLOR_ORDER.GRB,
    });

    strip.on("ready", function() {
        console.log("strip ready");
        // do stuff with the strip here.
       // var p = strip.pixel(0);
       // p.color("#0000FF");
       // strip.show();

       // strip.color("#ff0000"); // turns entire strip red using a hex colour
       // console.log("set color");
       // strip.show();
        //console.log("set show");
        //console.log(strip);
        //  var p = strips[0].strip.pixel(2);
        //  p.color("blue");
        //  strip.show();
        console.log("Strip ready, let's go");
        dynamicRainbow(fps);
   });
   function dynamicRainbow( delay ){
       console.log( 'dynamicRainbow' );

       var showColor;
       var cwi = 0; // colour wheel index (current position on colour wheel)
       var foo = setInterval(function(){
           if (++cwi > 255) {
               cwi = 0;
           }

           for(var i = 0; i < strip.stripLength(); i++) {
               showColor = colorWheel( ( cwi+i ) & 255 );
               strip.pixel( i ).color( showColor );
           }
           strip.show();
       }, 1000/delay);
   }

   // Input a value 0 to 255 to get a color value.
   // The colors are a transition r - g - b - back to r.
   function colorWheel( WheelPos ){
       var r,g,b;
       WheelPos = 255 - WheelPos;

       if ( WheelPos < 85 ) {
           r = 255 - WheelPos * 3;
           g = 0;
           b = WheelPos * 3;
       } else if (WheelPos < 170) {
           WheelPos -= 85;
           r = 0;
           g = WheelPos * 3;
           b = 255 - WheelPos * 3;
       } else {
           WheelPos -= 170;
           r = WheelPos * 3;
           g = 255 - WheelPos * 3;
           b = 0;
       }
       // returns a string with the rgb value to be used as the parameter
       return "rgb(" + r +"," + g + "," + b + ")";
   }


});
