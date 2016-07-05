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
    stripDial = [],
    stripBar = [],
    stripStatus = [],
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
            strips: [
              {pin: 6, length: 1},  // status
              {pin: 5, length: 12}, // dial
              {pin: 7, length: 8}, // bar
            ],
        });
        strip.on("ready", function() {
          console.log("Strip ready, let's go");
          //parse strips
          stripStatus.push(strip.pixel(0));

          for(var i=1;i<13;i++){
            stripDial.push(strip.pixel(i));
          }
          for(var j=13;j<21;j++){
            stripBar.push(strip.pixel(j));
          }
          console.log("strip length: " + strip.stripLength());
          console.log("stripStatus length: " + stripStatus.length);
          console.log("stripDial length: " + stripDial.length);
          // console.log("stripBar length: " + stripBar.length);

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
            dialController(cmd[property]);
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
    updateColor = function(arr, col){
      console.log("arr: " + arr.length);
      for(var i = 0; i < arr.length; i++) {
          arr[i].color( col );
      }
      strip.show();
    },
    statusController = function(state) {
      switch (state) {
        case false:
        console.log("set status red");
          updateColor(stripStatus, "red");
          break;
        case true:
          console.log("set status green");
          updateColor(stripStatus, "green");
          break;
      }
    },
    ledController = function(state) {
      switch (state) {
        case false:
        updateColor(stripBar, "white");
          break;
        case true:
        updateColor(stripBar, "blue");
          break;
      }
    },
    dialController = function(val) {
      console.log('dial value: ' + val);
      dialVal = val; //save last value
      var litnum = stripDial.length * val/100;
      console.log("litnum: " + litnum);

      for(var i = 0; i < stripDial.length; i++) {
          if(i < litnum){
            stripDial[i].color( "red" );
          }else{
            stripDial[i].color( "blue" );
          }
      }
      strip.show();

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
        statusController(true);

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
        statusController(false);

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
            dialController(cmd['dial']);
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
