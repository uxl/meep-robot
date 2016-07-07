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
    dial = null,
    bar = [61],

    colors = [],
    renderInt = null,
    fps = 1,

    strip = null,
    pixels = [],

    init = function() {
      for(var i = 1; i <= 60; i++){
        dial.push(i);
      }

      console.log(MEEP.init);
      board = new five.Board({
        //io: new Raspi()
      });

      //events
      board.on("ready", function() {

        strip = new pixel.Strip({
          board: this,
          controller: "FIRMATA",
          strips: [{
              pin: 6, //try 9
              length: 1
            }, // status
            {
              pin: 9, // try
              length: 60
            }, // dial
            {
              pin: 10,
              length: 1
            }, // bar
          ],
        });

        strip.on("ready", function() {
          console.log("strip ready");
          //set led default color to black
          for (var j = 0; j < 21; j++) {
            colors[j] = "black";
            pixels[j] = strip.pixel(j);
          }

          connect();
        });

      });
    },
    parseCmd = function(cmd) {
      console.log('cmd', cmd);

      for (property in cmd) {
        //console.log('property', property);
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
      var len = pixels.length;
      for (var i = 0; i < len; i++) {
        pixels[i].color(colors[i]);
        //console.log(i + " " + colors[i]);

      }
      strip.show();
    },
    startRender = function(){
      renderInt = setInterval(function(){
        render();
      },100/fps);
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
      render();
    },
    ledController = function(state) {
      switch (state) {
        case false:
          for (var i = 0; i < bar.length; i++) {
            colors[bar[i]] = "black";
          }
          break;
        case true:
          for (var i = 0; i < bar.length; i++) {
            colors[bar[i]] = "blue";
          }
          break;
      }
      render();
    },
    updateDial = function(val) {
      //console.log('dial value: ' + val);

      var litnum = dial.length * val / 100; // get how many leds are lit baised on percent
      //console.log("litnum: " + litnum);

      for (var i = 0; i < dial.length; i++) {
        if (i < litnum) {
          colors[dial[i]] = "red";
        } else {
          colors[dial[i]] = "black";
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

        if (reconnect) {
          //console.log(timestamp());
          //console.log('-------------');
          //may use parse to subtract times
          reconnect = false;
        };
        sendMeep({
          "status": "bot-syn"
        });
        updateStatus(true);

        //startRender();
        render();
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
