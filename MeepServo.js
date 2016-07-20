var five = require("johnny-five");
var Raspi = require("raspi-io");


var MeepServo = function() {};
  MeepServo.prototype.servo = null;

MeepServo.prototype.init = function(pin, min, max) {
  console.log('pin: ' + pin + ' | min: ' + min + ' | max: ' + max);

  MeepServo.prototype = new five.Servo({
    pin: pin,
    range: [min, max]
  });
};
MeepServo.prototype.to = function(val) {
  //this.servo.to(val);
};

module.exports = MeepServo;
