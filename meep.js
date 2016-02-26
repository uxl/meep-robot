var five = require("johnny-five");
var Raspi = require("raspi-io");

var hydna = require('hydna');
var channel = hydna.createChannel('http://ulx.hydna.net/test', 'rw');
var led = null;

var board = new five.Board({
  io: new Raspi()
});

var parseCmd = function(cmd) {
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
};

channel.on('connect', function() {
  // read/write connection is ready to use
  console.log('connected!!');
  var message = 'meep robot connected';
  channel.write(message);
});

channel.on('error', function(e) {
  // an error occured when connecting
  console.log('error: ' + e)

});
channel.on('data', function(cmdObj) {
  console.log('Channel "%s" recieved: %s', this.url, cmdObj);
  //determine device
    try {
      var cmd = JSON.parse(cmdObj);
    } catch (e) {
      console.log(e);
    }
    if(cmd hasOwnProperty("led")){
      console.log('woot');
      ledController(cmd['led']);
    }
});

board.on("ready", function() {
  led = new five.Led("P1-13");
});
var ledController = function(state) {
  console.log(state);
  switch (state) {
    case false:
      led.off();
      break;
    case true:
      led.on();
      break;
  }
}
var dialController = function(val) {
  console.log('dial value: ' + val)
}
