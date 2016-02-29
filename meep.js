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

    init = function() {
      console.log(MEEP.init);
      board = new five.Board({
        io: new Raspi()
      });
      //events
      board.on("ready", function() {
        led = new five.Led("P1-13");
      })
      connect();
    },
    connect = function() {
      channel = hydna.createChannel('http://ulx.hydna.net/test', 'rw');

      //add events
      channel.on('connect', function() {
        if (!connected) {
          console.log(new Date().getTime() - startTime);
          connected = true;
        }
        // read/write connection is ready to use
        console.log('connected!!');
        var message = 'meep robot connected';
        this.write(message);
      });

      channel.on('error', function(err) {
        // an error occured when connecting
        console.log('error: ' + err);
        console.log('reconnect attempt on error');
      });
      channel.on('close', function(err) {
        console.log('connection lost: ' + err);
        console.log('reconnect attempt on close');
        startTime = new Date().getTime();

        return setTimeout(connect, 3000);
      });
      channel.on('data', function(cmdObj) {
        // console.log('Channel "%s" recieved: %s', this.url, cmdObj);
        //determine device
        try {
          var cmd = JSON.parse(cmdObj);
          console.log(cmd);
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
    ledController = function(state) {
      switch (state) {
        case false:
          led.off();
          break;
        case true:
          led.on();
          break;
      }
    },
    dialController = function(val) {
      console.log('dial value: ' + val)
    };
  //connect
  return {
    init: init
  };
}());
