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
      test.add(3);
      var test = new TestModule();
      test.add(5);
      console.log(test.list);
      //console.log(list);
    };
  return {
    init: init
  };
}());

MEEP.init();
