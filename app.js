/*jshint strict:false */
/*jslint node: true */
/* global console, jQuery, $, TrackGA, setTimeout */

// meep robot

'use strict';

var MEEP = (function($) {
  //vars
  var pixel = require("node-pixel"), //addressble led library
    five = require("johnny-five"), //robotics library
    Raspi = require("raspi-io"), //allows us to use gpio on pi
    hydna = require('hydna'), // cloud websocket provider
    //prompt = require('prompt'), // allows command line user input

    //MeepServo = require('./MeepServo'), //node module

    channel = null,

    //ledR = null,
    //ledG = null,
    starttime = null,
    board = null,
    reconnect = false,
    startTime = null, // time reconnect
    stripArr = [status, dial, bar],
    servoArr = [],

    status = [0],
    dial = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    bar = [13, 14, 15, 16, 17, 18, 19, 20],

    colors = [],
    renderInt = null,
    fps = 30,
    servos = [],
    strip = null,
    pixels = [],

    // initialize the program
    // is called at the end of the block

    init = function() {
      console.log(MEEP.init);

      //initialize the five board
      //looks for arduino connected
      //via serial usb connection
      board = new five.Board({

      });

      //Runs when board is ready
      board.on("ready", function() {

        initServos();

        //create a new neopixel strx  ip
        strip = new pixel.Strip({
          board: this,
          controller: "FIRMATA",
          strips: [{
              pin: 12, //try 9
              length: 1
            }, // status
            {
              pin: 2, // try
              length: 12
            }, // dial
            {
              pin: 13,
              length: 8
            }, // bar
          ],
        });

        //when strip is ready sets all pixels
        //to off aka black
        strip.on("ready", function() {
          console.log("strip ready");
          //set led default color to black
          for (var j = 0; j < 21; j++) {
            colors[j] = "black";
            pixels[j] = strip.pixel(j);
          }

          //connect to hydna cloud service to listen
          //for frontend commands
          connect();
        });

      });
      board.on("exit", function() {
        //connection with board lost

      });
    },
    sendMeep = function(msg) {

      var data = JSON.stringify(msg);

      console.log('sendMeep: ' + data);
      console.log('sendMeep msg: ' + msg.data);
      try {
        channel.write(data);
      } catch (e) {
        console.log(e);
      }
    },
    lightsRender = function() {
      var len = pixels.length;
      for (var i = 0; i < len; i++) {
        pixels[i].color(colors[i]);
        //console.log(i + " " + colors[i]);
      }
      strip.show();
    },
    startServoRender = function() {
      renderInt = setInterval(function() {
        renderServos();
      }, 1000 / fps);
    },
    stopServoRender = function(){
      clearInterval(renderInt);
    },
    renderServos = function(){
      var len = servos.length;
      for(var s=0; s < len; s++){
        //may need to check that value has changed before sending command
        servos[s].to(servoArr[s].deg);
      }
    },
    updateStatus = function(state) {
      switch (state) {
        case false:
          console.log("set status red");
          colors[0] = "red";
          break;
        case true:
          console.log("set status green");
          colors[0] = "green";
          break;
      }
      lightsRender();
    },
    updateBar = function(val) {
      console.log('bar value: ' + val);
      var deg = Math.floor(180 * val / 100);
      //proportion how many lights need to be turned on
      var litnum = bar.length * val / 100; // get how many leds are lit baised on percent

      //loop through and update colors array to red for on and black for off
      for (var i = 0; i < bar.length; i++) {
        if (i < litnum) {
          colors[bar[i]] = "blue";
        } else {
          colors[bar[i]] = "black";
        }
      }
      lightsRender();
    },
    updateDial = function(val) {
      console.log('dial value: ' + val);
      var deg = Math.floor(180 * val / 100);
      //proportion how many lights need to be turned on
      var litnum = dial.length * val / 100; // get how many leds are lit baised on percent

      //loop through and update colors array to red for on and black for off
      for (var i = 0; i < dial.length; i++) {
        if (i < litnum) {
          colors[dial[i]] = "red";
        } else {
          colors[dial[i]] = "black";
        }
      }
      lightsRender();
    },

    updateServo = function(id, deg) {
      console.log('id: ' + id + ' | deg: ' + deg);
      //console.log(servoArr);
      servoArr[id].deg = deg;

      servos[id].to(deg);
    },
    initServos = function(){
      console.log('initServos');

      //sets pin number and range of degrees
      servos[0] = new five.Servo({
        pin: 3,
        range: [0, 180],
        startAt: 88
      }); //base

      servos[1] = new five.Servo({
        pin: 4,
        range: [0, 180],
        startAt: 144
      }); //segment 1

      servos[2] = new five.Servo({
        pin: 5,
        range: [0, 180],
        startAt: 127
      }); //segment 1

      servos[3] = new five.Servo({
        pin: 6,
        range: [0, 180],
        startAt: 91
      }); //segment 1

      servos[4] = new five.Servo({
        pin: 7,
        range: [0, 180],
        startAt: 91
      }); //segment 1

      servos[5] = new five.Servo({
        pin: 8,
        range: [0, 180],
        startAt: 175
      }); //segment 1
      //fills servoArr with initial values
      for(var p=0; p < servos.length; p++){
        servoArr[p] = {id:p, deg:servos[p].startAt};
      }
    },
    timestamp = function() {
      var d = new Date().toString();
      return d;
    },
    connect = function() {
      channel = hydna.createChannel('http://ulx.hydna.net/test', 'readwrite');

      //add events
      channel.on('connect', function() {
        //turn on green led

        if (reconnect) {
          //console.log(timestamp());
          //console.log('-------------');
          //may use parse to subtract times
          reconnect = false;
        }
        sendMeep({
          "status": "bot-syn"
        });
        updateStatus(true);

        startServoRender();
        lightsRender();
        // read/write connection is ready to use
      });
      channel.on('error', function(err) {
        // an error occured when connecting
        console.log('error: ' + err);
        console.log('reconnect attempt on error');
      });
      channel.on('close', function(err) {
        //turn on green led
        updateStatus(false);

        console.log('connection lost: ' + err);
        startTime = timestamp();
        console.log('-------------');
        console.log('reconnect..');
        console.log(startTime);
        reconnect = true;
        return setTimeout(connect, 3000);
      });
      channel.on('data', function(cmdObj) {
        // console.log('Channel "%s" recieved: %s', this.url, cmdObj);
        //determine device
        try {
          var cmd = JSON.parse(cmdObj);
          //console.log(cmd);

          //console.log(timestamp());
          if (cmd.hasOwnProperty('status')) {
            if (cmd.status == "client-syn") {
              sendMeep({
                "status": "bot-ack"
              });
            }
          }
          if (cmd.hasOwnProperty('bar')) {
            updateBar(cmd.bar);
          }
          if (cmd.hasOwnProperty('dial')) {
            updateDial(cmd.dial);
          }
          if (cmd.hasOwnProperty('servo')) {
            //node method of queuing commands
            process.nextTick(() => {
              // console.log('cmd.hadOwnProperty servo');
              var len = cmd.servo.length;
              for (var i = 0; i < len; i++) {
                updateServo(cmd.servo[i].id, cmd.servo[i].deg);
              }
            });
          }
        } catch (e) {
          console.log(e);
        }
      });
    };
  return {
    init: init
  };
}());

MEEP.init();
