var five = require("johnny-five");
var Raspi = require("raspi-io");

var MeepServos = function() {};

MeepServos.prototype.list = [];

MeepServos.prototype.add = function(pin, min, max) {
  console.log('pin: %s | min: %s | max: %s', pin, min, max);
  this.list.push(new five.Servo({
    pin: pin,
    range: [min, max]
  }));
};

MeepServos.prototype.servosTo = function(val) {
  console.log('servos to: ' + val );
  this.servos.stop();
  this.servos.to(val);
};
MeepServos.prototype.servoTo = function(val) {
  console.log('servos to: ' + val );
  this.servos.stop();
  this.servo.to(val);
};
MeepServos.prototype.servosSweep = function() {
  this.servos.sweep();
};
module.exports = MeepServos;
