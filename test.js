/* global console, jQuery, $, TrackGA */
// meep robot
// Mullen - Wilkinson 2016

'use strict';

var MEEP = (function($) {
  //vars
  var TestModule = require('./TestModule'),


    init = function() {
      console.log('test.init');

      //sends pin number and range of degrees
      var test = new TestModule();
      test.init(3, 10, 180);
      console.log(test.servo);
    };
  return {
    init: init
  };
}());

MEEP.init();
