
var TestModule = function() {};

var MeepServos = function() {};

TestModule.prototype.list = [];

TestModule.prototype.add = function(val) {
  this.list.push(val);
};

module.exports = TestModule;
