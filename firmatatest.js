/* global console, jQuery, $, TrackGA */
// meep robot
// Mullen - Wilkinson 2016

'use strict';

var five = require("johnny-five"),
    board = new five.Board(),
    led,
    toggleState = false;

    board.on("ready", function(){
        console.log('Board ready');
        led = new five.Led(13);

        setInterval(toggleLED,200);

        function toggleLED(){
            toggleState = !toggleState;

            if(toggleState){
                led.on();
            }else{
                led.off();
            }
        }
    });
    console.log("\nWaiting for device to connect...");

