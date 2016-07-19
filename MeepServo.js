// qux.js
var five = require("johnny-five");

var MeepServo = function() {};
MeepServo.prototype.servo = null;

MeepServo.prototype.setRange = function(pin, min, max) {
  console.log('pin: ' + pin + ' | min: ' + min + ' | max: ' + max);
  this.servo = new five.Servo({
    pin: pin,
    range: [min, max]
  });
};
MeepServo.prototype.moveTo = function(val) {
  this.servo.to(val);
};

exports.MeepServo = MeepServo;
