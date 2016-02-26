var five = require("johnny-five");
var Raspi = require("raspi-io");

var hydna = require('hydna');
var channel = hydna.createChannel('http://ulx.hydna.net/test', 'rw');
var led = null;

var board = new five.Board({
      io: new Raspi()
});

channel.on('connect', function() {
  // read/write connection is ready to use
  console.log('connected!!');
  var message = 'meep connected';
  channel.write(message);
});

channel.on('error', function(e) {
  // an error occured when connecting
  console.log('error: ' + e)

});
channel.on('data', function(cmdObj) {
  console.log('Channel "%s" recieved: %s', this.url, cmdObj);
  //determine device
  console.log('cmdObj', cmdObj);
  console.log('cmdObj.property', cmdObj[0]);
  if(cmdObj[0]){
    console.log('woot');
  }
  for ( property in cmdObj ) {
    switch (property) {
      case "led":
        console.log('led action');
        ledController(cmdObj[property]);
        break;
        case "dial":
        console.log('dial action');
          dialController(cmdObj[property]);
          break;
      default:
    }
  }

});

board.on("ready", function() {
      led = new five.Led("P1-13");
});
var ledController = function(state){
  console.log(state);
  switch(state){
    case false:
      led.off();
    break;
    case true:
      led.on();
    break;
  }
}
var dialController = function(val){
  console.log('dial value: ' + val)
}
