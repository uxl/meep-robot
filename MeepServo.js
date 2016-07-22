var five = require("johnny-five");
var Raspi = require("raspi-io");

var servo = new five.Servo(3);

var MeepServo = function() {};
// MeepServo.prototype.list = [];
MeepServo.prototype.init = function(pin, min, max) {
  console.log('pin: ' + pin + ' | min: ' + min + ' | max: ' + max);
  var that = this;
  that = new five.Servo({
    pin: pin,
    range: [min, max]
  });
  //this.list.push(me);
};

MeepServo.prototype.to = function(val) {
  console.log('servo to: ' + val );
  var that = this;

  that.servo.to(val);
};
MeepServo.prototype.sweep = function() {
  servo.sweep();
};
module.exports = MeepServo;
