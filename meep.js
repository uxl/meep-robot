var five = require("johnny-five");
var Raspi = require("raspi-io");

var hydna = require('hydna');
var channel = null;
var led = null;

var board = new five.Board({
  io: new Raspi()
});

var connectHy = function(){
  channel = hydna.createChannel('http://ulx.hydna.net/test', 'rw');
  channel.on('connect', function() {
    // read/write connection is ready to use
    console.log('connected!!');
    var message = 'meep robot connected';
    channel.write(message);
  });

  channel.on('error', function(err) {
    // an error occured when connecting
    console.log('error: ' + err);
    console.log('reconnect attempt on error');
  });
  channel.on('close', function(err){
    console.log('connection lost: ' + err);
    console.log('reconnect attempt on close');
    return setTimeout(connectHy, 3000);
  });
  channel.on('data', function(cmdObj) {
    // console.log('Channel "%s" recieved: %s', this.url, cmdObj);
    //determine device
      try {
        var cmd = JSON.parse(cmdObj);
        console.log(cmd);
        if(cmd.hasOwnProperty('led')){
          ledController(cmd['led']);
        }
        if(cmd.hasOwnProperty('dial')){
          dialController(cmd['dial']);
        }
      } catch (e) {
        console.log(e);
      }
  });
};
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

board.on("ready", function() {
  led = new five.Led("P1-13");
});
var ledController = function(state) {
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
//connect
connectHy();
