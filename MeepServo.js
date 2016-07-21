var five = require("johnny-five");
var Raspi = require("raspi-io");


var MeepServo = function() {};
MeepServo.prototype.list = [];
MeepServo.prototype.init = function(pin, min, max) {
  console.log('pin: ' + pin + ' | min: ' + min + ' | max: ' + max);

  var me = new five.Servo({
    pin: pin,
    range: [min, max]
  });
  this.list.push(me);
};
// MeepServo.prototype.to = function(val) {
//   console.log('servo to: ' + val );
//
//   this.servo.to(val);
// };

module.exports = MeepServo;
