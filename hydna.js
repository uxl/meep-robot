var five = require("johnny-five");
var Raspi = require("raspi-io");

var hydna = require('hydna');
var channel = hydna.createChannel('http://ulx.hydna.net/test', 'rw');

channel.on('connect', function() {
  // read/write connection is ready to use
  console.log('connected!!');
  var message = 'server connected';
  channel.write(message);
});

channel.on('error', function() {
  // an error occured when connecting
  console.log('error!!')

});
channel.on('data', function(data) {
  console.log('Channel "%s" recieved: %s', this.url, data);
  // Close the channel. The application will terminate once both
  led.blink(1);

});

board.on("ready", function() {
      var led = new five.Led("P1-13");
});
/*
var five = require("johnny-five");
var Raspi = require("raspi-io");

var PusherClient = require('./lib/pusher-node-client').PusherClient;

var board = new five.Board({
      io: new Raspi()
});

board.on("ready", function() {
      var led = new five.Led("P1-13");
        //led.blink();
});
*/
