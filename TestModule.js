
var TestModule = function() {};

TestModule.prototype.init = function(pin, min, max) {
  console.log('pin: ' + pin + ' | min: ' + min + ' | max: ' + max);

this.servo = {
    pin: pin,
    range: [min, max]
  };
  //return this.servo;
};

module.exports = TestModule;
