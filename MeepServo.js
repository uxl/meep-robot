var five = require("johnny-five");
var Raspi = require("raspi-io");

var MeepServo = function() {};
// MeepServo.prototype.list = [];
MeepServo.prototype.init = function(pin, min, max) {
  console.log('pin: %s | min: %s | max: %s', pin, min, max);
  this.servo = new five.Servo({
    pin: pin,
    range: [min, max]
  });
};

MeepServo.prototype.to = function(val) {
  console.log('servo to: ' + val );
  this.servo.stop();
  this.servo.to(val);
};
MeepServo.prototype.sweep = function() {
  this.servo.sweep();
};
module.exports = MeepServo;
