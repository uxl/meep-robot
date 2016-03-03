/* global console, jQuery, $, TrackGA */
// meep robot
// Mullen - Wilkinson 2016

'use strict';

var five = require("johnny-five");
var Raspi = require("raspi-io");
var hydna = require('hydna');

var MEEP = (function($) {
  //vars
  var channel = null,
    led = null,
    starttime = null,
    board = null,
    reconnect = false,
    startTime = null, // time reconnect

    init = function() {
      console.log(MEEP.init);
      board = new five.Board({
        io: new Raspi()
      });
      //events
      board.on("ready", function() {
        ledR = new five.Led("P1-13");
        ledG = new five.Led("P1-15");
      })
      connect();
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
    statusController = function(state) {
      switch (state) {
        case false:
          ledG.off();
          break;
        case true:
          ledG.on();
          break;
      }
    },
    ledController = function(state) {
      switch (state) {
        case false:
          ledR.off();
          break;
        case true:
          ledR.on();
          break;
      }
    },
    dialController = function(val) {
      console.log('dial value: ' + val);
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
