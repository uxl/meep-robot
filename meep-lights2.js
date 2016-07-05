/* global console, jQuery, $, TrackGA */
// meep robot
// Mullen - Wilkinson 2016

'use strict';

var pixel = require("node-pixel");
var five = require("johnny-five");
var Raspi = require("raspi-io");
var hydna = require('hydna');

var MEEP = (function($) {
  //vars
  var channel = null,
    //ledR = null,
    //ledG = null,
    starttime = null,
    board = null,
    reconnect = false,
    startTime = null, // time reconnect

    stripArr = [status, dial, bar],

    status = [0],
    dial = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    bar = [13, 14, 15, 16, 17, 18, 19, 20, 21],

    colors = [],

    strip = null,
    dialVal = 0,

    init = function() {
      console.log(MEEP.init);
      board = new five.Board({
        //io: new Raspi()
      });

      //events
      board.on("ready", function() {
        // ledR = new five.Led("P1-8");
        // ledG = new five.Led("P1-10");
        strip = new pixel.Strip({
          board: this,
          controller: "FIRMATA",
          strips: [{
              pin: 6,
              length: 1
            }, // status
            {
              pin: 5,
              length: 12
            }, // dial
            {
              pin: 7,
              length: 8
            }, // bar
          ],
        });

        strip.on("ready", function() {
          console.log("strip ready");
          //set led default color to black
          for (var j = 0; j < 21; j++) {
            colors[j] = "rgb(0, 0, 0)";
          }



          // for(var i=1;i<13;i++){
          //   colors[i] = "rgb(0, 0, 0)";
          // }

          // for(var j=13;j<21;j++){
          //   colors[j] = "rgb(0, 0, 0)";
          // }

          connect();
        });

      });
    },
    parseCmd = function(cmd) {
      console.log('cmd', cmd);

      for (property in cmd) {
        console.log('property', property);
        switch (property) {
          case "led":
            console.log('led action');
            ledController(cmd[property]);
            break;
          case "dial":
            console.log('dial action');
            updateDial(cmd[property]);
            break;
          default:
        }
      }
    },
    sendMeep = function(msg) {

      var data = JSON.stringify(msg);
      console.log('sendMeep: ' + data);
      console.log('sendMeep msg: ' + msg['data']);

      try {
        channel.write(data);
      } catch (e) {
        console.log(e);
      }
    },
    render = function() {
      console.log("render called")
      for (var i = 0; i < strip.stripLength(); i++) {
        strip.pixel(i).color(colors[i]);
      }
      console.log('colors: ' + colors);
      strip.show();
    },
    updateStatus = function(state) {
      switch (state) {
        case false:
          console.log("set status red");
          colors[0] = "rgb(255,0,0)";
          render();
          break;
        case true:
          console.log("set status green");
          colors[0] = "rgb(0,255,0)";
          render();
          break;
      }
    },
    ledController = function(state) {
      switch (state) {
        case false:
          for (var i = 0; i < bar.length; i++) {
            colors[bar[i]] = "rgb(0,0,0)";
          }
          break;
        case true:
          for (var i = 0; i < bar.length; i++) {
            colors[bar[i]] = "rgb(0,0,255)";
          }
          break;
      }
      render();
    },
    updateDial = function(val) {
      console.log('dial value: ' + val);
      dialVal = val; //save last value
      var litnum = dial.length * val / 100;
      console.log("litnum: " + litnum);

      for (var i = 0; i < dial.length; i++) {
        if (i < litnum) {
          colors[dial[i]] = "rgb(255,0,0)";
        } else {
          colors[dial[i]] = "rgb(0,0,0)";
        }
      }
      render();
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
        updateStatus(true);

        if (reconnect) {
          console.log(timestamp());
          console.log('-------------');
          //may use parse to subtract times
          reconnect = false;
        };
        sendMeep({
          "status": "bot-syn"
        });

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
          console.log(cmd);

          console.log(timestamp());
          if (cmd.hasOwnProperty('status')) {
            if (cmd['status'] == "client-syn") {
              sendMeep({
                "status": "bot-ack"
              });
            }
          }
          if (cmd.hasOwnProperty('led')) {
            ledController(cmd['led']);
          }
          if (cmd.hasOwnProperty('dial')) {
            updateDial(cmd['dial']);
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
