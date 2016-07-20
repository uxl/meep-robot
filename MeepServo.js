var five = require("johnny-five");

var MeepServo = function() {};
MeepServo.prototype.servo = null;

MeepServo.prototype.init = function(pin, min, max) {
  console.log('pin: ' + pin + ' | min: ' + min + ' | max: ' + max);
  this.servo = new five.Servo({
    pin: pin,
    range: [min, max]
  });
};
MeepServo.prototype.to = function(val) {
  this.servo.to(val);
};

module.exports = new MeepServo();
