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
        led = new five.Led("P1-13");
      })
      connect();
    },
    connect = function() {
      channel = hydna.createChannel('http://ulx.hydna.net/test', 'readwrite');

      //add events
      channel.on('connect', function() {
        if (reconnect) {
          console.log(Date.now() - startTime / 1000 + ' seconds');
          reconnect = false;
        };
        sendMeep({
          "status": "bot connected"
        });

        // read/write connection is ready to use
        console.log('connected');
      });
      channel.on('error', function(err) {
        // an error occured when connecting
        console.log('error: ' + err);
        console.log('reconnect attempt on error');
      });
      channel.on('close', function(err) {
        console.log('connection lost: ' + err);
        startTime = Date.now();
        console.log('reconnect attempt on close: ' + startTime);
        reconnect = true;
        return setTimeout(connect, 3000);
      });
      channel.on('data', function(cmdObj) {
        // console.log('Channel "%s" recieved: %s', this.url, cmdObj);
        //determine device
        try {
          var cmd = JSON.parse(cmdObj);
          console.log(cmd + ' ' + formatAMPM(Date.now()));
          if (cmd.hasOwnProperty('status')) {
            if (cmd['status'] == "client-online") {
              sendMeep({
                "status": "hi"
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
      console.log('sendMeep: ' + msg);
      console.log('sendMeep msg: ' + msg['data']);

      try {
        channel.write(data);
      } catch (e) {
        console.log(e);
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
    },
    formatAMPM = function(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    };
  return {
    init: init
  };
}());

MEEP.init();
